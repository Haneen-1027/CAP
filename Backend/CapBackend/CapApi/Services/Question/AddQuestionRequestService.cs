using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using CapApi.Data;
using CapApi.DTOs;
using CapApi.Models;

namespace CapApi.Services.Question
{
    public class AddQuestionRequestService(ApplicationDbContext context) : ControllerBase
    {
        public Task<IActionResult> Handle(AddQuestionDto dto)
        {
            if (string.IsNullOrEmpty(dto.Type) || string.IsNullOrEmpty(dto.Prompt) ||
                string.IsNullOrEmpty(dto.Category))
            {
                return Task.FromResult<IActionResult>(BadRequest(new
                    { Message = "Invalid request. All fields are required." }));
            }

            var question = new Models.Question
            {
                Type = dto.Type,
                Prompt = dto.Prompt,
                Category = dto.Category,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Handle different question types
            switch (dto.Type.ToLower())
            {
                case "mc":
                    if (dto.Details == null || !dto.Details.ContainsKey("correctAnswer") ||
                        !dto.Details.TryGetValue("wrongOptions", out var value))
                    {
                        return Task.FromResult<IActionResult>(BadRequest(new
                            { Message = "MCQ must have a correct answer and wrong options." }));
                    }

                    question.McqQuestion = new McqQuestion
                    {
                        IsTrueFalse =
                            dto.Details.ContainsKey("isTrueFalse") && (bool)dto.Details["isTrueFalse"],
                        CorrectAnswer = dto.Details["correctAnswer"].ToString(),
                        WrongOptions = ((JsonElement)value).EnumerateArray().Select(x => x.GetString() ?? string.Empty)
                            .ToList()
                    };
                    break;

                case "essay":
                    question.EssayQuestion = new EssayQuestion();
                    break;

                case "coding":
                    if (dto.Details == null || !dto.Details.ContainsKey("testCases") ||
                        !dto.Details.ContainsKey("inputsCount") ||
                        !dto.Details.TryGetValue("description", out var detail))
                    {
                        return Task.FromResult<IActionResult>(BadRequest(new
                            { Message = "Coding questions must have test cases, inputsCount, and description." }));
                    }

                    var codingQuestion = new CodingQuestion
                    {
                        InputsCount = int.Parse(dto.Details["inputsCount"].ToString() ?? string.Empty),
                        Description = detail.ToString() ?? string.Empty,
                        TestCases = ((JsonElement)dto.Details["testCases"]).EnumerateArray()
                            .Select(tc => new TestCase
                            {
                                Inputs = tc.GetProperty("inputs").EnumerateArray().Select(
                                    x => x.GetString() ?? string.Empty
                                ).ToList(),
                                ExpectedOutput = tc.GetProperty("expectedOutput").GetString() ?? string.Empty
                            }).ToList()
                    };

                    question.CodingQuestion = codingQuestion;
                    break;


                default:
                    return Task.FromResult<IActionResult>(BadRequest(new { Message = "Invalid question type." }));
            }

            context.Questions.Add(question);
            context.SaveChanges();

            return Task.FromResult<IActionResult>(Ok(new { Message = "Question Added", question.Id }));
        }
    }
}
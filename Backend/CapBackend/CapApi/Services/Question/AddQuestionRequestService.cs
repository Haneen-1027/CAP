using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using CapApi.Data;
using CapApi.DTOs;
using CapApi.Models;

namespace CapApi.Services.Question
{
    public class AddQuestionRequestService(ApplicationDbContext context) : ControllerBase
    {
        public Task<IActionResult> Handle(AddQuestionRequest request)
        {
            if (string.IsNullOrEmpty(request.Type) || string.IsNullOrEmpty(request.Prompt) ||
                string.IsNullOrEmpty(request.Category))
            {
                return Task.FromResult<IActionResult>(BadRequest(new
                    { Message = "Invalid request. All fields are required." }));
            }

            var question = new Models.Question
            {
                Type = request.Type,
                Prompt = request.Prompt,
                Category = request.Category,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Handle different question types
            switch (request.Type.ToLower())
            {
                case "mc":
                    if (request.Details == null || !request.Details.ContainsKey("correctAnswer") ||
                        !request.Details.TryGetValue("wrongOptions", out var value))
                    {
                        return Task.FromResult<IActionResult>(BadRequest(new
                            { Message = "MCQ must have a correct answer and wrong options." }));
                    }

                    question.McqQuestion = new McqQuestion
                    {
                        IsTrueFalse =
                            request.Details.ContainsKey("isTrueFalse") && (bool)request.Details["isTrueFalse"],
                        CorrectAnswer = request.Details["correctAnswer"].ToString(),
                        WrongOptions = ((JsonElement)value).EnumerateArray().Select(x => x.GetString() ?? string.Empty)
                            .ToList()
                    };
                    break;

                case "essay":
                    question.EssayQuestion = new EssayQuestion();
                    break;

                case "coding":
                    if (request.Details == null || !request.Details.ContainsKey("testCases") ||
                        !request.Details.ContainsKey("inputsCount") ||
                        !request.Details.TryGetValue("description", out var detail))
                    {
                        return Task.FromResult<IActionResult>(BadRequest(new
                            { Message = "Coding questions must have test cases, inputsCount, and description." }));
                    }

                    var codingQuestion = new CodingQuestion
                    {
                        InputsCount = int.Parse(request.Details["inputsCount"].ToString() ?? string.Empty),
                        Description = detail.ToString() ?? string.Empty,
                        TestCases = ((JsonElement)request.Details["testCases"]).EnumerateArray()
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
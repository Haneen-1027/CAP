using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using CapApi.Data;
using CapApi.DTOs;
using CapApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Services.Question
{
    public class UpdateQuestionService(ApplicationDbContext context) : ControllerBase
    {
        public async Task<IActionResult> Handle(int id, UpdateQuestionRequest updatedQuestion)
        {
            if (id <= 0 || string.IsNullOrEmpty(updatedQuestion.Type) || string.IsNullOrEmpty(updatedQuestion.Prompt) ||
                string.IsNullOrEmpty(updatedQuestion.Category))
            {
                return BadRequest(new { Message = "Invalid request. All fields are required." });
            }

            var question = context.Questions.Include(q => q.McqQuestion)
                .Include(q => q.EssayQuestion)
                .Include(q => q.CodingQuestion)
                .FirstOrDefault(q => q.Id == id);

            if (question == null)
            {
                return NotFound(new { Message = "Question not found." });
            }

            // Update question's general properties
            question.Type = updatedQuestion.Type;
            question.Prompt = updatedQuestion.Prompt;
            question.Category = updatedQuestion.Category;
            question.UpdatedAt = DateTime.UtcNow;

            // Handle different question types
            switch (updatedQuestion.Type.ToLower())
            {
                case "mc":
                    if (updatedQuestion.Details != null && (!updatedQuestion.Details.ContainsKey("correctAnswer") ||
                                                            !updatedQuestion.Details.ContainsKey("wrongOptions")))
                    {
                        return BadRequest(new { Message = "MCQ must have a correct answer and wrong options." });
                    }

                    question.McqQuestion ??= new McqQuestion();

                    question.McqQuestion.IsTrueFalse = updatedQuestion.Details != null &&
                                                       updatedQuestion.Details.ContainsKey("isTrueFalse") &&
                                                       ((JsonElement)updatedQuestion.Details["isTrueFalse"])
                                                       .GetBoolean();
                    if (updatedQuestion.Details != null)
                    {
                        question.McqQuestion.CorrectAnswer = updatedQuestion.Details["correctAnswer"].ToString();
                        question.McqQuestion.WrongOptions = ((JsonElement)updatedQuestion.Details["wrongOptions"])
                            .EnumerateArray().Select(x => x.GetString()).ToList();
                    }

                    break;

                case "essay":
                    question.EssayQuestion ??= new EssayQuestion();

                    break;

                case "coding":
                    if (updatedQuestion.Details != null && (!updatedQuestion.Details.ContainsKey("testCases") ||
                                                            !updatedQuestion.Details.ContainsKey("inputsCount") ||
                                                            !updatedQuestion.Details.ContainsKey("description")))
                    {
                        return BadRequest(new
                            { Message = "Coding questions must have test cases, inputsCount, and description." });
                    }

                    question.CodingQuestion ??= new CodingQuestion();

                    question.CodingQuestion.InputsCount =
                        int.Parse(updatedQuestion.Details?["inputsCount"].ToString() ??
                                  throw new InvalidOperationException());
                    question.CodingQuestion.Description = updatedQuestion.Details?["description"].ToString();
                    question.CodingQuestion.TestCases = ((JsonElement)(updatedQuestion.Details?["testCases"] ??
                                                                       throw new InvalidOperationException()))
                        .EnumerateArray()
                        .Select(tc => new TestCase
                        {
                            Inputs = tc.GetProperty("inputs").EnumerateArray().Select(x => x.GetString()).ToList(),
                            ExpectedOutput = tc.GetProperty("expectedOutput").GetString()
                        }).ToList();
                    break;

                default:
                    return BadRequest(new { Message = "Invalid question type." });
            }

            context.Questions.Update(question);
            await context.SaveChangesAsync();

            return Ok(new { Message = "Question Updated", question.Id });
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using CapApi.Data;
using CapApi.DTOs;
using CapApi.Models;

namespace CapApi.Services.Question
{
    public class AddQuestionRequestService(ApplicationDbContext context) : ControllerBase
    {
        public async Task<IActionResult> Handle(AddQuestionDto dto)
        {
            // Validate mandatory fields
            if (string.IsNullOrWhiteSpace(dto.Type) || string.IsNullOrWhiteSpace(dto.Prompt) ||
                string.IsNullOrWhiteSpace(dto.Category))
            {
                return BadRequest(new { Message = "Invalid request. All fields are required." });
            }

            var question = new Models.Question
            {
                Type = dto.Type.Trim().ToLower(),
                Prompt = dto.Prompt.Trim(),
                Category = dto.Category.Trim(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            try
            {
                // Handle different question types
                switch (question.Type)
                {
                    case "mc":
                        if (dto.Details == null || !dto.Details.ContainsKey("correctAnswer") ||
                            !dto.Details.TryGetValue("wrongOptions", out var value) ||
                            string.IsNullOrWhiteSpace(dto.Details["correctAnswer"].ToString()))
                        {
                            return BadRequest(new { Message = "MCQ must have a correct answer and wrong options." });
                        }

                        List<string> wrongOptions = ((JsonElement)value).EnumerateArray()
                            .Select(x => x.GetString()?.Trim() ?? string.Empty)
                            .Where(x => !string.IsNullOrEmpty(x)) // Ensure non-empty options
                            .ToList();

                        if (wrongOptions.Count == 0)
                        {
                            return BadRequest(new { Message = "MCQ must have at least one wrong option." });
                        }

                        question.McqQuestion = new McqQuestion
                        {
                            IsTrueFalse = dto.Details.ContainsKey("isTrueFalse") && 
                                         bool.TryParse(dto.Details["isTrueFalse"].ToString(), out var isTf) && isTf,
                            CorrectAnswer = dto.Details["correctAnswer"].ToString()?.Trim(),
                            WrongOptions = wrongOptions
                        };
                        break;

                    case "essay":
                        question.EssayQuestion = new EssayQuestion();
                        break;

                    case "coding":
                        if (dto.Details == null || !dto.Details.ContainsKey("testCases") ||
                            !dto.Details.ContainsKey("inputsCount") ||
                            !dto.Details.TryGetValue("description", out var detail) ||
                            string.IsNullOrWhiteSpace(detail.ToString()))
                        {
                            return BadRequest(new { Message = "Coding questions must have test cases, inputsCount, and description." });
                        }

                        if (!int.TryParse(dto.Details["inputsCount"].ToString(), out var inputsCount) || inputsCount < 1)
                        {
                            return BadRequest(new { Message = "InputsCount must be a valid positive integer." });
                        }

                        var testCases = ((JsonElement)dto.Details["testCases"]).EnumerateArray()
                            .Select(tc =>
                            {
                                try
                                {
                                    return new TestCase
                                    {
                                        Inputs = tc.GetProperty("inputs").EnumerateArray().Select(
                                            x => x.GetString()?.Trim() ?? string.Empty
                                        ).ToList(),
                                        ExpectedOutput = tc.GetProperty("expectedOutput").GetString()?.Trim() ?? string.Empty
                                    };
                                }
                                catch (Exception)
                                {
                                    return null; // Handle malformed test case
                                }
                            })
                            .Where(tc => tc is { Inputs.Count: > 0 } && !string.IsNullOrEmpty(tc.ExpectedOutput))
                            .ToList();

                        if (testCases.Count == 0)
                        {
                            return BadRequest(new { Message = "Coding questions must have at least one valid test case." });
                        }

                        question.CodingQuestion = new CodingQuestion
                        {
                            InputsCount = inputsCount,
                            Description = detail.ToString()?.Trim(),
                            TestCases = testCases
                        };
                        break;

                    default:
                        return BadRequest(new { Message = "Invalid question type." });
                }

                // Use a transaction to ensure rollback on failure
                await using var transaction = await context.Database.BeginTransactionAsync();
                try
                {
                    context.Questions.Add(question);
                    await context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return Ok(new { Message = "Question Added", question.Id });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, new { Message = "An error occurred while saving the question.", Error = ex.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Unexpected error occurred.", Error = ex.Message });
            }
        }
    }
}

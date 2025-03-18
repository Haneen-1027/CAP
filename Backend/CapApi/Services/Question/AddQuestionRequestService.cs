using Microsoft.AspNetCore.Mvc;
using CapApi.Data;
using CapApi.Dtos.Question;
using CapApi.Models;
using System.ComponentModel.DataAnnotations;

namespace CapApi.Services.Question;

public class AddQuestionRequestService(CapDbContext context) : ControllerBase
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
            // Ensure Details object is provided if required
            var details = dto.Details ?? new QuestionDetailsDto();

            // Handle different question types
            switch (question.Type)
            {
                case "mc":
                    if (details.CorrectAnswer == null || !details.CorrectAnswer.Any() || 
                        details.WrongOptions == null || details.WrongOptions.Count == 0)
                    {
                        return BadRequest(new
                        {
                            Message = "MCQ must have at least one correct answer and at least one wrong option."
                        });
                    }

                    question.McqQuestion = new McqQuestion
                    {
                        IsTrueFalse = details.IsTrueFalse ?? false,
                        CorrectAnswer = details.CorrectAnswer.Select(x => x.Trim()).Where(x => !string.IsNullOrEmpty(x)).ToList(),
                        WrongOptions = details.WrongOptions.Select(x => x.Trim()).Where(x => !string.IsNullOrEmpty(x)).ToList()
                    };
                    break;

                case "essay":
                    question.EssayQuestion = new EssayQuestion();
                    break;

                case "coding":
                    if (details.TestCases == null || details.TestCases.Count == 0 || details.InputsCount is null ||
                        details.InputsCount < 1 || string.IsNullOrWhiteSpace(details.Description))
                    {
                        return BadRequest(new
                        {
                            Message = "Coding questions must have test cases, inputsCount, and a description."
                        });
                    }

                    if (details.TestCases != null)
                    {
                        List<TestCase> testCases = details.TestCases
                            .Where(tc =>
                                tc.Inputs != null && tc.Inputs.Count > 0 && !string.IsNullOrWhiteSpace(tc.ExpectedOutput))
                            .Select(tc => new TestCase
                            {
                                Inputs = (tc.Inputs ?? throw new InvalidOperationException()).Select(i => i.Trim()).ToList(),
                                ExpectedOutput = tc.ExpectedOutput?.Trim()
                            })
                            .ToList();

                        if (testCases.Count == 0)
                        {
                            return BadRequest(new { Message = "Coding questions must have at least one valid test case." });
                        }

                        question.CodingQuestion = new CodingQuestion
                        {
                            InputsCount = details.InputsCount.Value,
                            Description = details.Description.Trim(),
                            TestCases = testCases
                        };
                    }
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
                return StatusCode(500,
                    new { Message = "An error occurred while saving the question.", Error = ex.Message });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Unexpected error occurred.", Error = ex.Message });
        }
    }
}
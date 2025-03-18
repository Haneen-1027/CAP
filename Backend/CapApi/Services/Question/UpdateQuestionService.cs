using Microsoft.AspNetCore.Mvc;
using CapApi.Data;
using CapApi.Dtos.Question;
using CapApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Services.Question;

public class UpdateQuestionService(CapDbContext context) : ControllerBase
{
    public async Task<IActionResult> Handle(int id, UpdateQuestionDto? dto)
    {
        // Validate input parameters
        if (id <= 0 || dto == null)
        {
            return BadRequest(new { Message = "Invalid request. Question ID and data are required." });
        }

        if (string.IsNullOrWhiteSpace(dto.Type) ||
            string.IsNullOrWhiteSpace(dto.Prompt) ||
            string.IsNullOrWhiteSpace(dto.Category) ||
            dto.Details == null)
        {
            return BadRequest(new { Message = "Invalid request. All fields are required." });
        }

        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            var question = await context.Questions
                .Include(q => q.McqQuestion)
                .Include(q => q.EssayQuestion)
                .Include(q => q.CodingQuestion)
                .ThenInclude(cq => cq.TestCases)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null)
            {
                return NotFound(new { Message = "Question not found." });
            }

            question.Type = dto.Type.Trim().ToLower();
            question.Prompt = dto.Prompt.Trim();
            question.Category = dto.Category.Trim();
            question.UpdatedAt = DateTime.UtcNow;

            var details = dto.Details ?? new QuestionDetailsDto();

            switch (question.Type)
            {
                case "mc":
                    if (details.CorrectAnswer == null || !details.CorrectAnswer.Any() || 
                        details.WrongOptions == null || details.WrongOptions.Count == 0 || details.IsTrueFalse == false)
                    {
                        return BadRequest(new
                        {
                            Message = "MCQ must have at least one correct answer and at least one wrong option."
                        });
                    }

                    question.McqQuestion ??= new McqQuestion();
                    question.McqQuestion.IsTrueFalse = details.IsTrueFalse ?? false;
                    question.McqQuestion.CorrectAnswer = details.CorrectAnswer
                        .Select(x => x.Trim())
                        .Where(x => !string.IsNullOrEmpty(x))
                        .ToList();
                    question.McqQuestion.WrongOptions = details.WrongOptions
                        .Select(x => x.Trim())
                        .Where(x => !string.IsNullOrEmpty(x))
                        .ToList();
                    break;

                case "essay":
                    question.EssayQuestion ??= new EssayQuestion();
                    break;

                case "coding":
                    if (details.TestCases == null || details.TestCases.Count == 0 || details.InputsCount is null ||
                        details.InputsCount < 1 || string.IsNullOrWhiteSpace(details.Description))
                    {
                        return BadRequest(new
                        {
                            Message = "Coding questions must have test cases, inputsCount, and description."
                        });
                    }

                    var testCases = details.TestCases
                        .Where(tc =>
                            tc.Inputs != null && tc.Inputs.Count > 0 &&
                            !string.IsNullOrWhiteSpace(tc.ExpectedOutput))
                        .Select(tc => new TestCase
                        {
                            Inputs =
                                (tc.Inputs ?? throw new InvalidOperationException()).Select(i => i.Trim()).ToList(),
                            ExpectedOutput = tc.ExpectedOutput?.Trim()
                        })
                        .ToList();

                    if (testCases.Count == 0)
                    {
                        return BadRequest(new
                        {
                            Message = "Coding questions must have at least one valid test case."
                        });
                    }

                    question.CodingQuestion ??= new CodingQuestion();
                    question.CodingQuestion.InputsCount = details.InputsCount.Value;
                    question.CodingQuestion.Description = details.Description.Trim();
                    question.CodingQuestion.TestCases = testCases;
                    break;

                default:
                    return BadRequest(new { Message = "Invalid question type." });
            }

            context.Questions.Update(question);
            await context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { Message = "Question Updated", question.Id });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500,
                new { Message = "An error occurred while updating the question.", Error = ex.Message });
        }
    }
}
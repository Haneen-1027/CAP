using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Data;

namespace CapApi.Services.Question;

public class QuestionByIdService(ApplicationDbContext context) : ControllerBase
{
    public async Task<IActionResult> Handle(int id)
    {
        // Validate Question ID
        if (id < 1)
        {
            return BadRequest(new { Message = "Id must be greater than 0." });
        }

        try
        {
            // Fetch question with related data
            var question = await context.Questions
                .Include(q => q.McqQuestion)
                .Include(q => q.CodingQuestion)
                .ThenInclude(cq => cq.TestCases)
                .Include(q => q.EssayQuestion)
                .Where(q => q.Id == id)
                .Select(q => new
                {
                    q.Id,
                    General = new
                    {
                        q.Type,
                        q.Prompt,
                        q.Category,
                        Details = GetDetailsBasedOnType(q)
                    }
                })
                .FirstOrDefaultAsync();

            if (question == null)
            {
                return NotFound(new { Message = "Question not found." });
            }

            return Ok(question);
        }
        catch (Exception ex)
        {
            return StatusCode(500,
                new { Message = "An error occurred while processing your request.", Error = ex.Message });
        }
    }

    private static object GetDetailsBasedOnType(Models.Question q)
    {
        if (string.IsNullOrEmpty(q.Type))
        {
            return new { Message = "Question type is missing." };
        }

        return q.Type.ToLower() switch
        {
            "mc" => q.McqQuestion != null
                ? new
                {
                    q.McqQuestion.IsTrueFalse,
                    q.McqQuestion.CorrectAnswer,
                    q.McqQuestion.WrongOptions
                }
                : new { Message = "MCQ data missing" },

            "essay" => q.EssayQuestion != null
                ? new { Message = "Essay details available." }
                : new { Message = "Essay data missing" },

            "coding" => q.CodingQuestion != null
                ? new
                {
                    q.CodingQuestion.Description,
                    q.CodingQuestion.InputsCount,
                    TestCases = q.CodingQuestion.TestCases.Select(tc => new
                    {
                        tc?.Inputs,
                        tc?.ExpectedOutput
                    }).ToList()
                }
                : new { Message = "Coding data missing" },

            _ => new { Message = "Invalid question type." }
        };
    }
}
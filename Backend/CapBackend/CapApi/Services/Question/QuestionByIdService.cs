using Microsoft.AspNetCore.Mvc;
using CapApi.Data;
using CapApi.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Services.Question
{
    public class QuestionByIdService(ApplicationDbContext context) : ControllerBase
    {
        public async Task<IActionResult> Handle(QuestionByIdDto? dto)
        {
            // Validate input DTO
            if (dto == null || string.IsNullOrEmpty(dto.QuestionId))
            {
                return BadRequest(new { Message = "Question ID is required." });
            }

            // Validate Question ID format
            if (!int.TryParse(dto.QuestionId, out var questionId))
            {
                return BadRequest(new { Message = "Invalid Question ID format." });
            }

            try
            {
                // Fetch the question from the database
                var question = await context.Questions
                    .Where(q => q.Id == questionId)
                    .Select(q => new
                    {
                        id = q.Id,
                        general = new
                        {
                            type = q.Type,
                            prompt = q.Prompt,
                            category = q.Category,
                            details = GetDetailsBasedOnType(q) // Get type-specific details
                        }
                    })
                    .FirstOrDefaultAsync();

                // Handle case where question is not found
                if (question == null)
                {
                    return NotFound(new { Message = "Question not found." });
                }

                // Return the question details
                return Ok(question);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request." });
            }
        }

        private static object GetDetailsBasedOnType(Models.Question q)
        {
            // Handle null or invalid question type
            if (string.IsNullOrEmpty(q.Type))
            {
                return new { Message = "Question type is missing." };
            }

            // Return type-specific details based on the question type
            return q.Type.ToLower() switch
            {
                "mc" => q.McqQuestion != null
                    ? new
                    {
                        isTrueFalse = q.McqQuestion.IsTrueFalse,
                        correctAnswer = q.McqQuestion.CorrectAnswer,
                        wrongOptions = q.McqQuestion.WrongOptions
                    }
                    : new { Message = "MCQ data missing" },

                "essay" => q.EssayQuestion != null
                    ? new { }
                    : new { Message = "Essay data missing" },

                "coding" => q.CodingQuestion != null
                    ? new
                    {
                        description = q.CodingQuestion.Description,
                        testCases = q.CodingQuestion.TestCases?.Select(tc => new
                        {
                            inputs = tc?.Inputs,
                            expectedOutput = tc?.ExpectedOutput
                        }).ToList()
                    }
                    : new { Message = "Coding data missing" },

                _ => new { Message = "Invalid question type." }
            };
        }
    }
}
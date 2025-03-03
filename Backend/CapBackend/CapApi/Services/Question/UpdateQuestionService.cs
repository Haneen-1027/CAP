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
        public async Task<IActionResult> Handle(int id, UpdateQuestionDto? dto)
        {
            // Validate input parameters
            if (id <= 0 || dto == null)
            {
                return BadRequest(new { Message = "Invalid request. Question ID and data are required." });
            }

            // Validate required fields in the DTO
            if (string.IsNullOrWhiteSpace(dto.Type) ||
                string.IsNullOrWhiteSpace(dto.Prompt) ||
                string.IsNullOrWhiteSpace(dto.Category) ||
                dto.Details == null)
            {
                return BadRequest(new { Message = "Invalid request. All fields are required." });
            }

            // Begin a database transaction
            await using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                // Fetch the question with related data
                var question = await context.Questions
                    .Include(q => q.McqQuestion)
                    .Include(q => q.EssayQuestion)
                    .Include(q => q.CodingQuestion)
                        .ThenInclude(codingQuestion => codingQuestion.TestCases)
                    .FirstOrDefaultAsync(q => q.Id == id);

                // Handle case where question is not found
                if (question == null)
                {
                    return NotFound(new { Message = "Question not found." });
                }

                // Update general properties of the question
                question.Type = dto.Type;
                question.Prompt = dto.Prompt;
                question.Category = dto.Category;
                question.UpdatedAt = DateTime.UtcNow;

                // Handle different question types
                switch (dto.Type.ToLower())
                {
                    case "mc":
                        // Validate MCQ-specific fields
                        if (!dto.Details.ContainsKey("correctAnswer") ||
                            !dto.Details.ContainsKey("wrongOptions"))
                        {
                            return BadRequest(new { Message = "MCQ must have a correct answer and wrong options." });
                        }

                        // Initialize MCQ question if null
                        question.McqQuestion ??= new McqQuestion();

                        // Update MCQ properties
                        question.McqQuestion.IsTrueFalse =
                            dto.Details.TryGetValue("isTrueFalse", out var isTrueFalse) &&
                            isTrueFalse is JsonElement elem && elem.GetBoolean();

                        question.McqQuestion.CorrectAnswer = dto.Details["correctAnswer"].ToString();
                        question.McqQuestion.WrongOptions = ((JsonElement)dto.Details["wrongOptions"])
                            .EnumerateArray()
                            .Select(x => x.GetString())
                            .Where(x => !string.IsNullOrWhiteSpace(x))
                            .ToList();

                        // Validate wrong options
                        if (question.McqQuestion.WrongOptions.Count < 1)
                        {
                            return BadRequest(new { Message = "MCQ must have at least one wrong option." });
                        }

                        break;

                    case "essay":
                        // Initialize Essay question if null
                        question.EssayQuestion ??= new EssayQuestion();
                        break;

                    case "coding":
                        // Validate Coding-specific fields
                        if (!dto.Details.ContainsKey("testCases") ||
                            !dto.Details.ContainsKey("inputsCount") ||
                            !dto.Details.ContainsKey("description"))
                        {
                            return BadRequest(new
                            {
                                Message = "Coding questions must have test cases, inputsCount, and description."
                            });
                        }

                        // Initialize Coding question if null
                        question.CodingQuestion ??= new CodingQuestion();

                        // Validate inputsCount
                        if (!int.TryParse(dto.Details["inputsCount"].ToString(), out var inputsCount) ||
                            inputsCount < 1)
                        {
                            return BadRequest(new { Message = "Invalid inputsCount value." });
                        }

                        // Update Coding properties
                        question.CodingQuestion.InputsCount = inputsCount;
                        question.CodingQuestion.Description = dto.Details["description"].ToString();

                        // Update test cases
                        question.CodingQuestion.TestCases = ((JsonElement)dto.Details["testCases"])
                            .EnumerateArray()
                            .Select(tc =>
                            {
                                if (!tc.TryGetProperty("inputs", out var inputsElem) ||
                                    !tc.TryGetProperty("expectedOutput", out var outputElem) ||
                                    !outputElem.ValueKind.Equals(JsonValueKind.String))
                                {
                                    return null;
                                }

                                return new TestCase
                                {
                                    Inputs = inputsElem.EnumerateArray()
                                        .Select(x => x.GetString())
                                        .Where(x => !string.IsNullOrWhiteSpace(x))
                                        .ToList(),
                                    ExpectedOutput = outputElem.GetString()
                                };
                            })
                            .Where(tc => tc != null)
                            .ToList();

                        // Validate test cases
                        if (question.CodingQuestion.TestCases.Count < 1)
                        {
                            return BadRequest(new
                            {
                                Message = "Coding questions must have at least one valid test case."
                            });
                        }

                        break;

                    default:
                        return BadRequest(new { Message = "Invalid question type." });
                }

                // Save changes to the database
                context.Questions.Update(question);
                await context.SaveChangesAsync();

                // Commit the transaction
                await transaction.CommitAsync();

                // Return success response
                return Ok(new { Message = "Question Updated", question.Id });
            }
            catch (Exception ex)
            {
                // Rollback the transaction in case of an error
                await transaction.RollbackAsync();

                // Return error response
                return StatusCode(500,
                    new { Message = "An error occurred while updating the question.", Error = ex.Message });
            }
        }
    }
}
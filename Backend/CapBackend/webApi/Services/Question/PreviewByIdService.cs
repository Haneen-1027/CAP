using Microsoft.AspNetCore.Mvc;
using webApi.Data;
using webApi.Models;
using webApi.DTOs;
using System.Text.Json;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;
using webApi.Services.Question;
using System.Linq.Expressions;


namespace webApi.Services.Question
{
    public class PreviewByIdService : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PreviewByIdService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Handle(QuestionIdRequest request)
        {
            if (string.IsNullOrEmpty(request.QuestionId))
            {
                return BadRequest(new { Message = "Question ID is required." });
            }

            // Convert QuestionId to an integer
            if (!int.TryParse(request.QuestionId, out int questionId))
            {
                return BadRequest(new { Message = "Invalid Question ID format." });
            }

            var question = _context.Questions
                .Where(q => q.Id == questionId)
                .Select(q => new
                {
                    id = q.Id,
                    general = new
                    {
                        type = q.Type,
                        //mark = q.Mark,
                        prompt = q.Prompt,
                        category = q.Category,
                        details = GetDetailsBasedOnType(q)
                    }
                })
                .FirstOrDefault();

            if (question == null)
            {
                return NotFound(new { Message = "Question not found." });
            }

            return Ok(question);
        }
        
        private static object GetDetailsBasedOnType(Models.Question q)
        {
            return q.Type.ToLower() switch
            {
                "mc" => q.MCQQuestion != null ? new
                {
                    isTrueFalse = q.MCQQuestion.IsTrueFalse,
                    correctAnswer = q.MCQQuestion.CorrectAnswer,
                    wrongOptions = q.MCQQuestion.WrongOptions
                } : new { Message = "MCQ data missing" },
    
                "essay" => q.EssayQuestion != null ? new { } : new { Message = "Essay data missing" },
    
                "coding" => q.CodingQuestion != null ? new
                {
                    description = q.CodingQuestion.Description, 
                    testCases = q.CodingQuestion.TestCases?.Select(tc => new
                    {
                        inputs = tc.Inputs,
                        expectedOutput = tc.ExpectedOutput
                    }).ToList()
                } : new { Message = "Coding data missing" },
    
    
                _ => new { Message = "Invalid question type." }
            };
        }
        
    }
}
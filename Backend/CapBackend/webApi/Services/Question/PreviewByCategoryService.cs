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
    public class PreviewByCategoryService : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PreviewByCategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Handle(CategoryRequest request)
        { 
            if (request == null)
        {
            return BadRequest(new { Message = "Request body is required." });
        }
    
        IQueryable<Models.Question> query = _context.Questions;
    
        // Apply category filter if provided
        if (!string.IsNullOrEmpty(request.Category))
        {
            query = query.Where(q => q.Category == request.Category);
        }
    
        // Apply type filter if provided
        if (!string.IsNullOrEmpty(request.Type))
        {
            query = query.Where(q => q.Type == request.Type);
        }
    
        // Count total questions in category (ignores type filter)
        int totalCategoryQuestions = string.IsNullOrEmpty(request.Category)
            ? _context.Questions.Count()
            : _context.Questions.Count(q => q.Category == request.Category);
    
        // Count total questions in type (ignores category filter)
        int totalTypeQuestions = string.IsNullOrEmpty(request.Type)
            ? _context.Questions.Count()
            : _context.Questions.Count(q => q.Type == request.Type);
    
        // Apply pagination
        var questions = query
            .OrderBy(q => q.Id)  // Ensure consistent ordering
            .Skip((request.PageNumber - 1) * request.NumberOfQuestions)
            .Take(request.NumberOfQuestions)
            .Select(q => new
            {
                type = q.Type,
                //mark = q.Mark,
                prompt = q.Prompt,
                category = q.Category,
                details = GetDetailsBasedOnType(q)
            })
            .ToList();
    
        return Ok(new
        {
            totalCategoryQuestions,
            totalTypeQuestions,
            questions,
            returnMessage = "Done!"
        });
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
using Microsoft.AspNetCore.Mvc;
using CapApi.Data;
using CapApi.DTOs;

namespace CapApi.Services.Question
{
    public class PreviewByCategoryService(ApplicationDbContext context) : ControllerBase
    {
        public Task<IActionResult> Handle(CategoryRequest request)
        {
            IQueryable<Models.Question> query = context.Questions;

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
            var totalCategoryQuestions = string.IsNullOrEmpty(request.Category)
                ? context.Questions.Count()
                : context.Questions.Count(q => q.Category == request.Category);

            // Count total questions in type (ignores category filter)
            var totalTypeQuestions = string.IsNullOrEmpty(request.Type)
                ? context.Questions.Count()
                : context.Questions.Count(q => q.Type == request.Type);

            // Apply pagination
            var questions = query
                .OrderBy(q => q.Id) // Ensure consistent ordering
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

            return Task.FromResult<IActionResult>(Ok(new
            {
                totalCategoryQuestions,
                totalTypeQuestions,
                questions,
                returnMessage = "Done!"
            }));
        }

        private static object GetDetailsBasedOnType(Models.Question q)
        {
            return q.Type?.ToLower() switch
            {
                "mc" => q.McqQuestion != null
                    ? new
                    {
                        isTrueFalse = q.McqQuestion.IsTrueFalse,
                        correctAnswer = q.McqQuestion.CorrectAnswer,
                        wrongOptions = q.McqQuestion.WrongOptions
                    }
                    : new { Message = "Mcq data missing" },

                "essay" => q.EssayQuestion != null ? new { } : new { Message = "Essay data missing" },

                "coding" => q.CodingQuestion != null
                    ? new
                    {
                        description = q.CodingQuestion.Description,
                        testCases = q.CodingQuestion.TestCases.Select(tc => new
                        {
                            inputs = tc.Inputs,
                            expectedOutput = tc.ExpectedOutput
                        }).ToList()
                    }
                    : new { Message = "Coding data missing" },


                _ => new { Message = "Invalid question type." }
            };
        }
    }
}
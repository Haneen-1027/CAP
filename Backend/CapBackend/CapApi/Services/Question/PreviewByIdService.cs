using Microsoft.AspNetCore.Mvc;
using CapApi.Data;
using CapApi.DTOs;


namespace CapApi.Services.Question
{
    public class PreviewByIdService(ApplicationDbContext context) : ControllerBase
    {
        public Task<IActionResult> Handle(QuestionIdRequest request)
        {
            if (string.IsNullOrEmpty(request.QuestionId))
            {
                return Task.FromResult<IActionResult>(BadRequest(new { Message = "Question ID is required." }));
            }

            // Convert QuestionId to an integer
            if (!int.TryParse(request.QuestionId, out int questionId))
            {
                return Task.FromResult<IActionResult>(BadRequest(new { Message = "Invalid Question ID format." }));
            }

            var question = context.Questions
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
                return Task.FromResult<IActionResult>(NotFound(new { Message = "Question not found." }));
            }

            return Task.FromResult<IActionResult>(Ok(question));
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
                    : new { Message = "MCQ data missing" },

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
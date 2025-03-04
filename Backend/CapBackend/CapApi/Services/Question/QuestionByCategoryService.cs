using Microsoft.EntityFrameworkCore;
using CapApi.Data;

namespace CapApi.Services.Question
{
    public class QuestionByCategoryService(ApplicationDbContext context)
    {
        public async Task<object> Handle(string? category, string? type, int pageNumber, int numberOfQuestions)
        {
            IQueryable<Models.Question> query = context.Questions
                .Include(q => q.McqQuestion)
                .Include(q => q.CodingQuestion)
                    .ThenInclude(cq => cq.TestCases)
                .Include(q => q.EssayQuestion);

            // Apply filters
            if (!string.IsNullOrEmpty(category))
                query = query.Where(q => q.Category == category);

            if (!string.IsNullOrEmpty(type))
                query = query.Where(q => q.Type == type);

            // fetch counts in a single query
            var totalCounts = await context.Questions
                .Where(q => (string.IsNullOrEmpty(category) || q.Category == category) &&
                            (string.IsNullOrEmpty(type) || q.Type == type))
                .GroupBy(q => 1)
                .Select(g => new
                {
                    TotalCategoryQuestions = g.Count(q => string.IsNullOrEmpty(category) || q.Category == category),
                    TotalTypeQuestions = g.Count(q => string.IsNullOrEmpty(type) || q.Type == type)
                })
                .FirstOrDefaultAsync() ?? new { TotalCategoryQuestions = 0, TotalTypeQuestions = 0 };

            // Fetch paginated questions
            var questions = await query
                .OrderBy(q => q.Id) // Ensure consistent ordering
                .Skip((pageNumber - 1) * numberOfQuestions)
                .Take(numberOfQuestions)
                .Select(q => new
                {
                    q.Id,
                    q.Type,
                    q.Prompt,
                    q.Category,
                    q.CreatedAt,
                    q.UpdatedAt,
                    Details = GetDetailsBasedOnType(q)
                })
                .ToListAsync();

            return new
            {
                totalCategoryQuestions = totalCounts.TotalCategoryQuestions,
                totalTypeQuestions = totalCounts.TotalTypeQuestions,
                questions,
                returnMessage = "Done!"
            };
        }

        private static object GetDetailsBasedOnType(Models.Question q)
        {
            return q.Type?.ToLower() switch
            {
                "mc" => q.McqQuestion != null
                    ? new
                    {
                        q.McqQuestion.IsTrueFalse,
                        q.McqQuestion.CorrectAnswer,
                        q.McqQuestion.WrongOptions
                    }
                    : new { Message = "Mcq data missing" },

                "essay" => q.EssayQuestion != null ? new { } : new { Message = "Essay data missing" },

                "coding" => q.CodingQuestion != null
                    ? new
                    {
                        q.CodingQuestion.Description,
                        q.CodingQuestion.InputsCount,
                        TestCases = q.CodingQuestion.TestCases.Select(tc => new
                        {
                            tc.Inputs,
                            tc.ExpectedOutput
                        }).ToList()
                    }
                    : new { Message = "Coding data missing" },

                _ => new { Message = "Invalid question type." }
            };
        }
    }
}

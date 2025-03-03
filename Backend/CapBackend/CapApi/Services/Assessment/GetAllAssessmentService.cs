using CapApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Services.Assessment
{
    public class GetAllAssessmentService(ApplicationDbContext context, ILogger<GetAllAssessmentService> logger)
    {
        private readonly ApplicationDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        private readonly ILogger<GetAllAssessmentService> _logger =
            logger ?? throw new ArgumentNullException(nameof(logger));

        // Constructor for dependency injection

        public async Task<IActionResult> Handle()
        {
            try
            {
                // Fetch assessments with related questions and their details
                var assessments = await _context.Assessments
                    .Include(a => a.AssessmentQuestions)
                    .ThenInclude(aq => aq.Question)
                    .AsNoTracking() // Optimization: Avoids unnecessary tracking
                    .ToListAsync();

                if (assessments.Count == 0)
                {
                    _logger.LogInformation("No assessments found.");
                    return new NotFoundObjectResult(new { Message = "No assessments found." });
                }

                // Construct DTO response
                var assessmentDto = assessments.Select(a => new
                {
                    a.Id,
                    a.Name,
                    Duration = a.Duration.ToString(),
                    Time = a.AssessmentDate.ToString("yyyy-MM-dd HH:mm:ss"),
                    StartTime = a.StartTime.ToString("HH:mm:ss"),
                    EndTime = a.EndTime.ToString("HH:mm:ss"),
                    a.TotalMark,
                    a.QuestionsCount,
                    Questions = a.AssessmentQuestions.Select(aq => new
                    {
                        aq.QuestionId,
                        aq.Question?.Prompt, // Ensure Question exists before accessing Prompt
                        aq.Mark
                    })
                });

                return new OkObjectResult(assessmentDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving assessments.");
                return new ObjectResult(new { Message = "An internal error occurred while fetching assessments." })
                    { StatusCode = 500 };
            }
        }
    }
}
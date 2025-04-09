using CapApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Services.Assessment;

public class GetAllAssessmentService(CapDbContext context, ILogger<GetAllAssessmentService> logger)
{
    private readonly CapDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

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
                Duration = a.Duration.ToString(@"hh\:mm\:ss") ?? "00:00:00",
                Time = a.AssessmentDate.ToString("yyyy-MM-dd"),
                StartTime = a.StartTime.ToString(@"hh\:mm\:ss") ?? "00:00:00",
                EndTime = a.EndTime.ToString(@"hh\:mm\:ss") ?? "00:00:00",
                a.TotalMark,
                a.QuestionsCount,
                Questions = a.AssessmentQuestions.Select(aq => new
                {
                    aq.QuestionId,
                    aq.Question?.Prompt,
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
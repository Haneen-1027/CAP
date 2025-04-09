using CapApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Services.Assessment;

public class GetAssessmentByIdService(CapDbContext context, ILogger<GetAssessmentByIdService> logger)
{
    private readonly CapDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
    private readonly ILogger<GetAssessmentByIdService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    // Constructor for dependency injection

    public async Task<IActionResult> Handle(int id)
    {
        try
        {
            // Validate input ID
            if (id <= 0)
            {
                _logger.LogWarning("Invalid assessment ID: {Id}", id);
                return new BadRequestObjectResult(new { Message = "Invalid assessment ID." });
            }

            // Fetch assessment from database with related questions
            var assessment = await _context.Assessments
                .Include(a => a.AssessmentQuestions)
                .ThenInclude(aq => aq.Question)
                .AsNoTracking() // Optimization: Read-only mode for better performance
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assessment is null)
            {
                _logger.LogInformation("Assessment not found. ID: {Id}", id);
                return new NotFoundObjectResult(new { Message = "Assessment not found." });
            }

            // Construct response DTO
            var assessmentDto = new
            {
                assessment.Id,
                assessment.Name,
                Duration = assessment.Duration.ToString(@"hh\:mm\:ss") ?? "00:00:00",
                Time = assessment.AssessmentDate.ToString("yyyy-MM-dd"),
                StartTime = assessment.StartTime.ToString(@"hh\:mm\:ss") ?? "00:00:00",
                EndTime = assessment.EndTime.ToString(@"hh\:mm\:ss") ?? "00:00:00",
                assessment.TotalMark,
                assessment.QuestionsCount,
                Questions = assessment.AssessmentQuestions.Select(aq => new
                {
                    aq.QuestionId,
                    aq.Question?.Prompt,
                    aq.Mark
                })
            };

            return new OkObjectResult(assessmentDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving assessment with ID: {Id}", id);
            return new ObjectResult(new { Message = "An internal error occurred while fetching the assessment." })
            {
                StatusCode = 500
            };
        }
    }
}
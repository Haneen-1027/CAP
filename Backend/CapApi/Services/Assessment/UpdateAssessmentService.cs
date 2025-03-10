using Microsoft.AspNetCore.Mvc;
using CapApi.Data;
using CapApi.DTOs;
using CapApi.Dtos.Assessment;
using CapApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Services.Assessment;

public class UpdateAssessmentService(CapDbContext context, ILogger<UpdateAssessmentService> logger)
{
    private readonly CapDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

    private readonly ILogger<UpdateAssessmentService> _logger =
        logger ?? throw new ArgumentNullException(nameof(logger));

    // Constructor for dependency injection

    public async Task<IActionResult> Handle(int id, UpdateAssessmentDto? dto)
    {
        if (dto == null)
        {
            return new BadRequestObjectResult(new { Message = "Invalid request. Cannot be null." });
        }

        if (string.IsNullOrWhiteSpace(dto.Name) || dto.TotalMark <= 0 || dto.QuestionsCount <= 0)
        {
            return new BadRequestObjectResult(new
                { Message = "Invalid request. Ensure all required fields are provided and valid." });
        }

        if (dto.QuestionsIds == null || !dto.QuestionsIds.Any())
        {
            return new BadRequestObjectResult(new { Message = "Invalid request. Questions list cannot be empty." });
        }

        // Ensure ID is valid
        if (id <= 0)
        {
            return new BadRequestObjectResult(new { Message = "Invalid assessment ID." });
        }

        // Use a database transaction to ensure consistency
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var assessment = await _context.Assessments
                .Include(a => a.AssessmentQuestions)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assessment == null)
            {
                return new NotFoundObjectResult(new { Message = "Assessment not found." });
            }

            // Validate question IDs
            var providedQuestionIds = dto.QuestionsIds.Select(q => q.Id).ToList();
            var existingQuestionIds = await _context.Questions
                .Where(q => providedQuestionIds.Contains(q.Id))
                .Select(q => q.Id)
                .ToListAsync();

            var invalidIds = providedQuestionIds.Except(existingQuestionIds).ToList();
            if (invalidIds.Any())
            {
                return new BadRequestObjectResult(new
                    { Message = $"Invalid Question IDs: {string.Join(", ", invalidIds)}" });
            }

            // Parse time-related fields safely
            if (!TimeSpan.TryParse(dto.Duration, out var duration) ||
                !DateTime.TryParse(dto.Time, out var assessmentDate) ||
                !TimeSpan.TryParse(dto.StartTime, out var startTime) ||
                !TimeSpan.TryParse(dto.EndTime, out var endTime))
            {
                return new BadRequestObjectResult(new { Message = "Invalid date/time format." });
            }

            // Update assessment details
            assessment.Name = dto.Name;
            assessment.Duration = duration;
            assessment.AssessmentDate = assessmentDate;
            assessment.StartTime = startTime;
            assessment.EndTime = endTime;
            assessment.TotalMark = dto.TotalMark;
            assessment.QuestionsCount = dto.QuestionsCount;
            assessment.UpdatedAt = DateTime.UtcNow;

            // Remove old questions
            _context.AssessmentQuestions.RemoveRange(assessment.AssessmentQuestions);

            // Add new questions
            var newAssessmentQuestions = dto.QuestionsIds.Select(q => new AssessmentQuestion
            {
                AssessmentId = assessment.Id,
                QuestionId = q.Id,
                Mark = q.Mark
            }).ToList();

            await _context.AssessmentQuestions.AddRangeAsync(newAssessmentQuestions);
            await _context.SaveChangesAsync();

            // Commit transaction
            await transaction.CommitAsync();

            return new OkObjectResult(new { Message = "Assessment updated successfully." });
        }
        catch (Exception ex)
        {
            // Rollback transaction if an error occurs
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error updating assessment with ID: {Id}", id);
            return new ObjectResult(new { Message = "An internal error occurred while updating the assessment." })
            {
                StatusCode = 500
            };
        }
    }
}
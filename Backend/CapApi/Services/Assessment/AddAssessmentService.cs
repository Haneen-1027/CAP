using CapApi.Data;
using CapApi.DTOs.Assessment;
using CapApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Services.Assessment;

public class AddAssessmentService(CapDbContext context) : ControllerBase
{
    public async Task<IActionResult> Handle([FromBody] AddAssessmentDto? dto)
    {
        // Validate input DTO
        if (dto == null || dto.QuestionsIds == null || dto.QuestionsIds.Count == 0)
        {
            return BadRequest(new { Message = "Invalid request. Ensure all required fields are provided." });
        }

        // Validate date/time fields
        if (!TimeSpan.TryParse(dto.Duration, out var duration) ||
            !DateTime.TryParse(dto.AssessmentDate, out var assessmentDate) ||
            !TimeSpan.TryParse(dto.StartTime, out var startTime) ||
            !TimeSpan.TryParse(dto.EndTime, out var endTime))
        {
            return BadRequest(new { Message = "Invalid date/time format." });
        }

        // Validate start time is before end time
        if (startTime >= endTime)
        {
            return BadRequest(new { Message = "Start time must be before end time." });
        }

        // Fetch questions from the database based on provided IDs
        var questionIds = dto.QuestionsIds.Select(q => q.Id).ToList();
        var questions = await context.Questions
            .Where(q => questionIds.Contains(q.Id))
            .ToListAsync();

        // Validate that all questions exist in the database
        if (questions.Count != dto.QuestionsIds.Count)
        {
            return BadRequest(new { Message = "One or more questions not found in the database." });
        }

        // Begin a database transaction
        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            // Create the assessment
            var assessment = new Models.Assessment
            {
                Name = dto.Name,
                Duration = duration,
                AssessmentDate = assessmentDate,
                StartTime = startTime,
                EndTime = endTime,
                TotalMark = dto.TotalMark,
                QuestionsCount = dto.QuestionsCount,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Add the assessment to the database
            context.Assessments.Add(assessment);
            await context.SaveChangesAsync();

            // Create assessment-question relationships
            var assessmentQuestions = dto.QuestionsIds.Select(q => new AssessmentQuestion
            {
                AssessmentId = assessment.Id,
                QuestionId = q.Id,
                Mark = q.Mark
            }).ToList();

            // Add assessment-question relationships to the database
            context.AssessmentQuestions.AddRange(assessmentQuestions);
            await context.SaveChangesAsync();

            // Commit the transaction
            await transaction.CommitAsync();

            // Return success response
            return Ok(new { Message = "Assessment created successfully", AssessmentId = assessment.Id });
        }
        catch (Exception ex)
        {
            // Rollback the transaction in case of an error
            await transaction.RollbackAsync();

            // Return error response
            return StatusCode(500,
                new { Message = "An error occurred while creating the assessment.", Error = ex.Message });
        }
    }
}
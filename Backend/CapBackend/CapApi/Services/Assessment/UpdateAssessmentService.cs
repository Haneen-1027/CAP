using Microsoft.AspNetCore.Mvc;
using CapApi.Data;
using CapApi.DTOs;
using CapApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Services.Assessment
{
    public class UpdateAssessmentService(ApplicationDbContext context) : ControllerBase
    {
        public async Task<IActionResult> Handle(int id, UpdateAssessmentDto dto)
        {
            var assessment = await context.Assessments
                .Include(a => a.AssessmentQuestions)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assessment == null)
            {
                return NotFound(new { Message = "Assessment not found." });
            }

            if (dto.QuestionsIds == null || !dto.QuestionsIds.Any())
            {
                return BadRequest(new { Message = "Invalid request. Ensure all required fields are provided." });
            }

            var providedQuestionIds = dto.QuestionsIds.Select(q => q.Id).ToList();
            var existingQuestionIds = await context.Questions
                .Where(q => providedQuestionIds.Contains(q.Id))
                .Select(q => q.Id)
                .ToListAsync();

            var invalidIds = providedQuestionIds.Except(existingQuestionIds).ToList();
            if (invalidIds.Any())
            {
                return BadRequest(new { Message = $"Invalid Question IDs: {string.Join(", ", invalidIds)}" });
            }

            if (!TimeSpan.TryParse(dto.Duration, out var duration) ||
                !DateTime.TryParse(dto.Time, out var assessmentDate) ||
                !TimeSpan.TryParse(dto.StartTime, out var startTime) ||
                !TimeSpan.TryParse(dto.EndTime, out var endTime))
            {
                return BadRequest(new { Message = "Invalid date/time format." });
            }

            assessment.Name = dto.Name;
            assessment.Duration = duration;
            assessment.AssessmentDate = assessmentDate;
            assessment.StartTime = startTime;
            assessment.EndTime = endTime;
            assessment.TotalMark = dto.TotalMark;
            assessment.QuestionsCount = dto.QuestionsCount;
            assessment.UpdatedAt = DateTime.UtcNow;

            context.AssessmentQuestions.RemoveRange(assessment.AssessmentQuestions);

            var newAssessmentQuestions = dto.QuestionsIds.Select(q => new AssessmentQuestion
            {
                AssessmentId = assessment.Id,
                QuestionId = q.Id,
                Mark = q.Mark
            }).ToList();

            await context.AssessmentQuestions.AddRangeAsync(newAssessmentQuestions);
            await context.SaveChangesAsync();

            return Ok(new { Message = "Assessment updated successfully." });
        }
    }
}
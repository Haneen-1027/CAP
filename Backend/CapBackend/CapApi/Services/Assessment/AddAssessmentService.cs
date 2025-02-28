using CapApi.Data;
using CapApi.DTOs;
using CapApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Services.Assessment
{
    public class AddAssessmentService(ApplicationDbContext context) : ControllerBase
    {
        public async Task<IActionResult> Handle([FromBody] CreateAssessmentDto dto)
        {
            if (dto.QuestionsIds == null || dto.QuestionsIds.Count == 0)
            {
                return BadRequest(new { Message = "Invalid request. Ensure all required fields are provided." });
            }

            var questionIds = dto.QuestionsIds.Select(q => q.Id).ToList();
            var questions = await context.Questions.Where(q => questionIds.Contains(q.Id)).ToListAsync();

            if (questions.Count != dto.QuestionsIds.Count)
            {
                return BadRequest(new { Message = "One or more questions not found in the database." });
            }

            if (!TimeSpan.TryParse(dto.Duration, out var duration) ||
                !DateTime.TryParse(dto.AssessmentDate, out var assessmentDate) ||
                !TimeSpan.TryParse(dto.StartTime, out var startTime) ||
                !TimeSpan.TryParse(dto.EndTime, out var endTime))
            {
                return BadRequest(new { Message = "Invalid date/time format." });
            }

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

            context.Assessments.Add(assessment);
            await context.SaveChangesAsync();

            var assessmentQuestions = dto.QuestionsIds.Select(q => new AssessmentQuestion
            {
                AssessmentId = assessment.Id,
                QuestionId = q.Id,
                Mark = q.Mark
            }).ToList();

            context.AssessmentQuestions.AddRange(assessmentQuestions);
            await context.SaveChangesAsync();

            return Ok(new { Message = "Assessment created successfully", AssessmentId = assessment.Id });
        }
    }
}
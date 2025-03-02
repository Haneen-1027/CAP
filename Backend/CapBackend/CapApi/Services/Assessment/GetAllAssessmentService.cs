using CapApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Services.Assessment
{
    public class GetAllAssessmentService(ApplicationDbContext context) : ControllerBase
    {
        public async Task<IActionResult> Handle()
        {
            var assessments = await context.Assessments
                .Include(a => a.AssessmentQuestions)
                .ThenInclude(aq => aq.Question)
                .ToListAsync();

            if (assessments.Count == 0)
            {
                return NotFound(new { Message = "No assessments found." });
            }

            var assessmentDto = assessments.Select(a => new
            {
                a.Id,
                a.Name,
                Duration = a.Duration.ToString(),
                Time = a.AssessmentDate.ToString("yyyy-MM-dd HH:mm:ss"),
                StartTime = a.StartTime.ToString(),
                EndTime = a.EndTime.ToString(),
                a.TotalMark,
                a.QuestionsCount,
                Questions = a.AssessmentQuestions.Select(aq => new
                {
                    aq.QuestionId,
                    aq.Question?.Prompt,
                    aq.Mark
                })
            });

            return Ok(assessmentDto);
        }
    }
}
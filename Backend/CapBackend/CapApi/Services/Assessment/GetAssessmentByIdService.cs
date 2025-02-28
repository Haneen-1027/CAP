using CapApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace CapApi.Services.Assessment
{
    public class GetAssessmentByIdService(ApplicationDbContext context) : ControllerBase
    {
        public async Task<IActionResult> Handle(int id)
        {
            var assessment = await context.Assessments
                .Include(a => a.AssessmentQuestions)
                .ThenInclude(aq => aq.Question)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assessment is null)
            {
                return NotFound(new { Message = "Assessment not found." });
            }

            return Ok(new
            {
                assessment.Id,
                assessment.Name,
                Duration = assessment.Duration.ToString(),
                Time = assessment.AssessmentDate.ToString("yyyy-MM-dd HH:mm:ss"),
                StartTime = assessment.StartTime.ToString(),
                EndTime = assessment.EndTime.ToString(),
                assessment.TotalMark,
                assessment.QuestionsCount,
                Questions = assessment.AssessmentQuestions.Select(aq => new
                {
                    aq.QuestionId,
                    aq.Question?.Prompt,
                    aq.Mark
                })
            });
        }
    }
}
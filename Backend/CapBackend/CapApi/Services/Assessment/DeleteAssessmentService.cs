using CapApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Services.Assessment
{
    public class DeleteAssessmentService(ApplicationDbContext context) : ControllerBase
    {
        public async Task<IActionResult> Handle(int id)
        {
            var assessment = await context.Assessments
                .Include(a => a.AssessmentQuestions)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assessment == null)
            {
                return NotFound(new { Message = "Assessment not found." });
            }

            context.AssessmentQuestions.RemoveRange(assessment.AssessmentQuestions);
            context.Assessments.Remove(assessment);

            await context.SaveChangesAsync();

            return Ok(new { Message = "Assessment deleted successfully." });
        }
    }
}
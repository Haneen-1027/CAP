using CapApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Services.Assessment
{
    public class DeleteAssessmentService(ApplicationDbContext context, ILogger<DeleteAssessmentService> logger)
    {
        private readonly ApplicationDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly ILogger<DeleteAssessmentService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        // Constructor for dependency injection

        public async Task<IActionResult> Handle(int id)
        {
            if (id <= 0)
            {
                _logger.LogWarning("Invalid assessment ID provided: {Id}", id);
                return new BadRequestObjectResult(new { Message = "Invalid assessment ID. It must be greater than zero." });
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Retrieve the assessment with related questions
                var assessment = await _context.Assessments
                    .Include(a => a.AssessmentQuestions)
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (assessment == null)
                {
                    _logger.LogWarning("Assessment with ID {Id} not found.", id);
                    return new NotFoundObjectResult(new { Message = "Assessment not found." });
                }

                // Remove related questions first
                if (assessment.AssessmentQuestions.Any())
                {
                    _context.AssessmentQuestions.RemoveRange(assessment.AssessmentQuestions);
                }

                // Remove the assessment
                _context.Assessments.Remove(assessment);

                // Save changes
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Assessment with ID {Id} deleted successfully.", id);
                return new OkObjectResult(new { Message = "Assessment deleted successfully." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(); // Rollback transaction in case of failure
                _logger.LogError(ex, "An error occurred while deleting assessment with ID {Id}.", id);
                return new ObjectResult(new { Message = "An internal error occurred while deleting the assessment." }) { StatusCode = 500 };
            }
        }
    }
}

using CapApi.Data;
using Microsoft.AspNetCore.Mvc;

namespace CapApi.Services.Question;

public class DeleteQuestionService(CapDbContext context, ILogger<DeleteQuestionService> logger)
{
    private readonly CapDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
    private readonly ILogger<DeleteQuestionService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task<IActionResult> Handle(int id)
    {
        if (id <= 0)
        {
            return new BadRequestObjectResult(new { Message = "Invalid question ID." });
        }

        try
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
            {
                return new NotFoundObjectResult(new { Message = "Question not found." });
            }

            // Using a transaction to ensure data integrity
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.Questions.Remove(question);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return new OkObjectResult(new { Message = "Question deleted successfully." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error deleting question with ID {Id}", id);
                return new StatusCodeResult(500); // Internal Server Error
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error occurred while deleting question with ID {Id}", id);
            return new StatusCodeResult(500); // Internal Server Error
        }
    }
}
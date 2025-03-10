using Microsoft.AspNetCore.Mvc;
using CapApi.Data;

namespace CapApi.Services.User;

public class UpdateUserService(CapDbContext context, ILogger<UpdateUserService> logger)
{
    private readonly CapDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
    private readonly ILogger<UpdateUserService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    // Constructor for dependency injection

    public async Task<IActionResult> Handle(int id, Models.User? updatedUser)
    {
        if (id <= 0)
        {
            _logger.LogWarning("Invalid user ID provided: {Id}", id);
            return new BadRequestObjectResult("Invalid user ID. It must be greater than zero.");
        }

        if (updatedUser == null)
        {
            _logger.LogWarning("Null updatedUser object received for ID: {Id}", id);
            return new BadRequestObjectResult("User data cannot be null.");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Retrieve the user by ID
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                _logger.LogWarning("User with ID {Id} not found.", id);
                return new NotFoundObjectResult($"User with ID {id} not found.");
            }

            // Validate required fields (assumed required: FirstName, LastName, Email)
            if (string.IsNullOrWhiteSpace(updatedUser.FirstName) ||
                string.IsNullOrWhiteSpace(updatedUser.LastName) ||
                string.IsNullOrWhiteSpace(updatedUser.Email))
            {
                _logger.LogWarning("User update request contains empty required fields for ID {Id}", id);
                return new BadRequestObjectResult("First name, last name, and email are required.");
            }

            // Ensure the email is valid
            if (!IsValidEmail(updatedUser.Email))
            {
                _logger.LogWarning("Invalid email format for ID {Id}: {Email}", id, updatedUser.Email);
                return new BadRequestObjectResult("Invalid email format.");
            }

            // Update user properties
            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Email = updatedUser.Email;
            user.DateOfBirth = updatedUser.DateOfBirth;

            // Save changes
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            _logger.LogInformation("User with ID {Id} successfully updated.", id);
            return new NoContentResult();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(); // Rollback transaction in case of failure
            _logger.LogError(ex, "An error occurred while updating user with ID {Id}.", id);
            return new ObjectResult("An internal error occurred while updating the user.") { StatusCode = 500 };
        }
    }

    // Email validation helper method
    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
}
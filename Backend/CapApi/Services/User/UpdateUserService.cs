using Microsoft.AspNetCore.Mvc;
using CapApi.Data;
using CapApi.DTOs;
using CapApi.Dtos.User;
using System.Text.Json.Serialization;

namespace CapApi.Services.User;

public class UpdateUserService(CapDbContext context, ILogger<UpdateUserService> logger)
{
    private readonly CapDbContext _context = context ?? throw new ArgumentNullException(nameof(context));
    private readonly ILogger<UpdateUserService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task<IActionResult> Handle(int id, UserUpdateDto updatedUser)
    {
        if (id <= 0 || id != updatedUser.Id)
        {
            _logger.LogWarning("Invalid user ID provided: {Id}", id);
            return new BadRequestObjectResult("Invalid user ID. ID must match and be greater than zero.");
        }

        if (updatedUser == null)
        {
            _logger.LogWarning("Null updatedUser object received for ID: {Id}", id);
            return new BadRequestObjectResult("User data cannot be null.");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                _logger.LogWarning("User with ID {Id} not found.", id);
                return new NotFoundObjectResult($"User with ID {id} not found.");
            }

            // Validate required fields
            if (string.IsNullOrWhiteSpace(updatedUser.Username) ||
                string.IsNullOrWhiteSpace(updatedUser.FirstName) ||
                string.IsNullOrWhiteSpace(updatedUser.LastName) ||
                string.IsNullOrWhiteSpace(updatedUser.Email))
            {
                _logger.LogWarning("Missing required fields for user ID {Id}", id);
                return new BadRequestObjectResult("Username, first name, last name, and email are required.");
            }

            // Validate email format
            if (!IsValidEmail(updatedUser.Email))
            {
                _logger.LogWarning("Invalid email format for ID {Id}: {Email}", id, updatedUser.Email);
                return new BadRequestObjectResult("Invalid email format.");
            }

            // Validate role
            var validRoles = new[] { "Admin", "Contributor", "Viewer" };
            if (!validRoles.Contains(updatedUser.Role))
            {
                _logger.LogWarning("Invalid role '{Role}' provided for user ID {Id}", updatedUser.Role, id);
                return new BadRequestObjectResult("Invalid user role specified.");
            }

            // Update user properties (excluding password and timestamps)
            user.Username = updatedUser.Username;
            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Email = updatedUser.Email;
            user.Role = updatedUser.Role;
            user.DateOfBirth = updatedUser.DateOfBirth;
            user.UpdatedAt = DateTime.UtcNow; // Auto-update timestamp

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            _logger.LogInformation("User with ID {Id} updated successfully", id);
            
            // Return updated user data (excluding sensitive fields)
            return new OkObjectResult(new
            {
                user.Id,
                user.Username,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Role,
                user.DateOfBirth,
                user.CreatedAt,
                user.UpdatedAt
            });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error updating user {Id}", id);
            return new ObjectResult(new 
            {
                Message = "An error occurred while updating the user.",
                Error = ex.Message
            }) 
            { 
                StatusCode = 500 
            };
        }
    }

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
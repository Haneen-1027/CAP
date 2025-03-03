using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Data;

namespace CapApi.Services.User
{
    public class GetAllUsersService(ApplicationDbContext context, ILogger<GetAllUsersService> logger)
    {
        private readonly ApplicationDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        private readonly ILogger<GetAllUsersService>
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        // Constructor to inject dependencies
        public async Task<IActionResult> Handle()
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Fetch users from database
                var users = await _context.Users.ToListAsync();

                // Edge case: If no users exist, return a 404 response
                if (users.Count == 0)
                {
                    _logger.LogWarning("No users found in the database.");
                    return new NotFoundObjectResult("No users found.");
                }

                // Commit transaction on success
                await transaction.CommitAsync();
                return new OkObjectResult(users);
            }
            catch (Exception ex)
            {
                // Log error and rollback transaction
                _logger.LogError(ex, "An error occurred while fetching users.");

                return new ObjectResult("An internal error occurred while fetching users.") { StatusCode = 500 };
            }
        }
    }
}
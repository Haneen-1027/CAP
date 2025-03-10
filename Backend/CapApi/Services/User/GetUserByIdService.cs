using Microsoft.AspNetCore.Mvc;
using CapApi.Data;

namespace CapApi.Services.User;

public class GetUserByIdService(CapDbContext context, ILogger<GetUserByIdService> logger)
{
    private readonly CapDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

    private readonly ILogger<GetUserByIdService>
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    // Constructor for dependency injection

    public async Task<IActionResult> Handle(int id)
    {
        try
        {
            // Validate ID: Must be greater than zero
            if (id <= 0)
            {
                _logger.LogWarning("Invalid user ID provided: {Id}", id);
                return new BadRequestObjectResult("Invalid user ID. It must be greater than zero.");
            }

            // Retrieve user by ID
            var user = await _context.Users.FindAsync(id);

            // Handle case where user is not found
            if (user == null)
            {
                _logger.LogWarning("User with ID {Id} not found.", id);
                return new NotFoundObjectResult($"User with ID {id} not found.");
            }

            return new OkObjectResult(user);
        }
        catch (Exception ex)
        {
            // Log error and return a 500 response
            _logger.LogError(ex, "An error occurred while fetching user with ID {Id}.", id);
            return new ObjectResult("An internal error occurred while retrieving the user.") { StatusCode = 500 };
        }
    }
}
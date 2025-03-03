using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Data;

namespace CapApi.Services.User
{
    public class DeleteUserService(ApplicationDbContext context)
    {
        private readonly ApplicationDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task<IActionResult> Handle(int id)
        {
            // Validate the input ID (should be positive)
            if (id <= 0)
                return new BadRequestObjectResult("Invalid user ID.");

            try
            {
                var user = await _context.Users.FindAsync(id);

                // If user does not exist, return 404
                if (user == null)
                    return new NotFoundObjectResult($"User with ID {id} not found.");

                _context.Users.Remove(user);

                // Attempt to save changes
                await _context.SaveChangesAsync();

                return new NoContentResult();
            }
            catch (DbUpdateException ex)
            {
                // Log the error (assumed logging mechanism)
                await Console.Error.WriteLineAsync($"Database update error occured while deleting user {id}: {ex.Message}");

                // Return an internal server error response
                return new ObjectResult("An error occurred while deleting the user.")
                {
                    StatusCode = 500
                };
            }
            catch (Exception ex)
            {
                // Log the unexpected error
                await Console.Error.WriteLineAsync($"Unexpected error while deleting user {id}: {ex.Message}");

                return new ObjectResult("An unexpected error occurred.")
                {
                    StatusCode = 500
                };
            }
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using CapApi.Data;

namespace CapApi.Services.User
{
    public class UpdateUserService(ApplicationDbContext context)
    {
        public async Task<IActionResult> Handle(int id, Models.User updatedUser)
        {
            var user = await context.Users.FindAsync(id);
            if (user == null)
                return new NotFoundResult();

            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Email = updatedUser.Email;
            user.DateOfBirth = updatedUser.DateOfBirth;

            await context.SaveChangesAsync();
            return new NoContentResult();
        }
    }
}
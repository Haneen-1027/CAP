using Microsoft.AspNetCore.Mvc;
using CapApi.Data;

namespace CapApi.Services.User
{
    public class DeleteUserService(ApplicationDbContext context)
    {
        public async Task<IActionResult> Handle(int id)
        {
            var user = await context.Users.FindAsync(id);
            if (user == null)
                return new NotFoundResult();

            context.Users.Remove(user);
            await context.SaveChangesAsync();

            return new NoContentResult();
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Data;

namespace CapApi.Services.User
{
    public class GetAllUsersService(ApplicationDbContext context)
    {
        public async Task<IActionResult> Handle()
        {
            var users = await context.Users.ToListAsync();
            return new OkObjectResult(users);
        }
    }
}
using CapApi.Data;
using Microsoft.AspNetCore.Mvc;

namespace CapApi.Services.User
{
    public class CreateUserService(ApplicationDbContext context)
    {
        public async Task<IActionResult> Handle(Models.User newUser)
        {
            if (string.IsNullOrEmpty(newUser.Password))
                return new BadRequestObjectResult("User data and password are required.");

            newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);

            context.Users.Add(newUser);
            await context.SaveChangesAsync();

            return new CreatedAtActionResult(nameof(GetUserByIdService), "User", new { id = newUser.Id }, newUser);
        }
    }
}
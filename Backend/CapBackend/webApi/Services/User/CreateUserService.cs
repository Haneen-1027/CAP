using Microsoft.AspNetCore.Mvc;
using webApi.Data;
using webApi.Models;


namespace webApi.Services.User
{
    public class CreateUserService
    {
        private readonly ApplicationDbContext _context;

        public CreateUserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Handle(Models.User newUser)
        {
            if (newUser == null || string.IsNullOrEmpty(newUser.Password))
                return new BadRequestObjectResult("User data and password are required.");

            newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return new CreatedAtActionResult(nameof(GetUserByIdService), "User", new { id = newUser.Id }, newUser);
        }
    }
}
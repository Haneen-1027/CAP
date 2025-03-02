using CapApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace CapApi.Services.User
{
    public class CreateUserService(ApplicationDbContext context)
    {
        public async Task<IActionResult> Handle(Models.User? newUser)
        {
            if (newUser == null)
                return new BadRequestObjectResult("User data is required.");

            if (string.IsNullOrWhiteSpace(newUser.Username))
                return new BadRequestObjectResult("Username is required.");

            if (!Regex.IsMatch(newUser.Username, "^[a-zA-Z0-9_.-]{3,20}$"))
                return new BadRequestObjectResult("Invalid username format. Must be 3-20 characters and contain only letters, numbers, or '_', '.', '-'.");

            if (string.IsNullOrWhiteSpace(newUser.Email))
                return new BadRequestObjectResult("Email is required.");

            if (!Regex.IsMatch(newUser.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                return new BadRequestObjectResult("Invalid email format.");

            if (string.IsNullOrWhiteSpace(newUser.Password))
                return new BadRequestObjectResult("Password is required.");

            if (newUser.Password.Length < 8)
                return new BadRequestObjectResult("Password must be at least 8 characters long.");

            if (!newUser.Password.Any(char.IsUpper) || !newUser.Password.Any(char.IsDigit))
                return new BadRequestObjectResult("Password must contain at least one uppercase letter and one digit.");

            var existingUser = await context.Users.AnyAsync(u => u.Username == newUser.Username || u.Email == newUser.Email);
            if (existingUser)
                return new ConflictObjectResult("A user with the same username or email already exists.");

            newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);

            context.Users.Add(newUser);
            await context.SaveChangesAsync();

            return new CreatedAtRouteResult("GetUserById", new { id = newUser.Id }, newUser);
        }
    }
}

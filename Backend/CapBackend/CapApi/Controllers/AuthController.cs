using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Data;
using CapApi.DTOs;
using CapApi.Models;
using CapApi.Services;
using Microsoft.AspNetCore.Cors;

namespace CapApi.Controllers
{
    [ApiController]
    [Route("auth")]
    [EnableCors("AllowOrigin")]
    public class AuthController(JwtTokenGenerator jwtTokenGenerator, ApplicationDbContext context)
        : ControllerBase
    {
        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                // Check if username is already in use
                var existingUsername = await context.Users.AnyAsync(u => u.Username == dto.Username);
                if (existingUsername)
                    return Conflict(new { Message = "Username is already taken." });

                // Check if email is already in use
                var existingEmail = await context.Users.AnyAsync(u => u.Email == dto.Email);
                if (existingEmail)
                    return Conflict(new { Message = "Email is already taken." });

                // Validate password strength
                if (dto.Password != null && (dto.Password is { Length: < 8 } || !dto.Password.Any(char.IsDigit) ||
                                             !dto.Password.Any(char.IsLetter)))
                {
                    return BadRequest(new
                    {
                        Message = "Password must be at least 8 characters long and contain both letters and numbers."
                    });
                }

                // Hash the password
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

                var newUser = new User
                {
                    Username = dto.Username,
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Role = "User",
                    Email = dto.Email,
                    Password = hashedPassword,
                    DateOfBirth = dto.DateOfBirth,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                context.Users.Add(newUser);
                await context.SaveChangesAsync();

                await transaction.CommitAsync();

                return CreatedAtAction(nameof(SignUp), new { id = newUser.Id },
                    new { Message = "User created successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Message = "An error occurred during signup.", Error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            {
                return BadRequest(new { Message = "Email and password are required." });
            }

            await using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                var user = await context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
                if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                {
                    return Unauthorized(new { Message = "Invalid email or password." });
                }

                var token = jwtTokenGenerator.GenerateToken(user.Email, user.Role);

                await transaction.CommitAsync();

                return Ok(new
                {
                    Token = token,
                    User = new
                    {
                        user.Id, user.Email, user.Username, user.FirstName, user.LastName, user.Role, user.DateOfBirth,
                        user.CreatedAt, user.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Message = "An error occurred during login.", Error = ex.Message });
            }
        }
    }
}
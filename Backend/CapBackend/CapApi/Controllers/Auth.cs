using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Data;
using CapApi.DTOs;
using CapApi.Services;
using Microsoft.AspNetCore.Cors;

namespace CapApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors("AllowOrigin")]
    public class Auth(JwtTokenGenerator jwtTokenGenerator, ApplicationDbContext context)
        : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { Message = "Email and password are required." });
            }

            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized(new { Message = "Invalid email or password." });
            }
            
                var token = jwtTokenGenerator.GenerateToken(user.Email, user.Role);
                return Ok(new { Token = token, User = new { user.Id, user.Email, user.FirstName, user.LastName } });
            
        }

    }
}
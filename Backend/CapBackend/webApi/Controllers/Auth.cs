using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webApi.Models;
using webApi.Data;
using webApi.DTOs;
using webApi.Services;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;

namespace webApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Auth : ControllerBase
    {
        private readonly JwtTokenGenerator _jwtTokenGenerator;
        private readonly ApplicationDbContext _context;

        public Auth(JwtTokenGenerator jwtTokenGenerator, ApplicationDbContext context)
        {
            _jwtTokenGenerator = jwtTokenGenerator;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { Message = "Email and password are required." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized(new { Message = "Invalid email or password." });
            }

            var token = _jwtTokenGenerator.GenerateToken(user.Email,"Admin");
            return Ok(new { Token = token, User = new { user.Id, user.Email, user.FirstName, user.LastName } });
        }

    }
}
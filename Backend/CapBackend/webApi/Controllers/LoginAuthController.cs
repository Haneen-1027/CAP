using Microsoft.AspNetCore.Mvc;
using webApi.Models;
namespace webApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginAuthController : ControllerBase
    {
        private readonly JwtTokenGenerator _jwtTokenGenerator;

        public LoginAuthController(JwtTokenGenerator jwtTokenGenerator)
        {
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {

            if (request.Username == "admin" && request.Password == "password")
            {
                var token = _jwtTokenGenerator.GenerateToken(request.Username);
                return Ok(new { Token = token });
            }

            return Unauthorized("Invalid username or password");
        }
    }
}

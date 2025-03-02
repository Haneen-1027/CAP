using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CapApi.Models;
using Microsoft.IdentityModel.Tokens;

namespace CapApi.Services
{
    public class JwtTokenGenerator(IOptions<JwtSettings> jwtSettings)
    {
        private readonly JwtSettings _jwtSettings =
            jwtSettings.Value ?? throw new ArgumentNullException(nameof(jwtSettings));

        public string GenerateToken(string? email, string? role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity([
                    new Claim(ClaimTypes.Email, email ?? throw new ArgumentNullException(nameof(email))),
                    new Claim(ClaimTypes.Role, role ?? throw new ArgumentNullException(nameof(role)))
                ]),
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using webApi.Data;

namespace webApi.Services.User
{
    public class GetAllUsersService
    {
        private readonly ApplicationDbContext _context;

        public GetAllUsersService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Handle()
        {
            var users = await _context.Users.ToListAsync();
            return new OkObjectResult(users);
        }
    }
}
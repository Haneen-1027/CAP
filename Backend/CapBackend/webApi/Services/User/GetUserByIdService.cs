using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using webApi.Data;
using webApi.Models;

namespace webApi.Services.User
{
    public class GetUserByIdService
    {
        private readonly ApplicationDbContext _context;

        public GetUserByIdService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Handle(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return new NotFoundResult();

            return new OkObjectResult(user);
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using webApi.Data;
using webApi.Models;

namespace webApi.Services.User
{
    public class DeleteUserService
    {
        private readonly ApplicationDbContext _context;

        public DeleteUserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Handle(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return new NotFoundResult();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return new NoContentResult();
        }
    }
}
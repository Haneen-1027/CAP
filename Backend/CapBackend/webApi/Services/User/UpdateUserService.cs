using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using webApi.Data;
using webApi.Models;

namespace webApi.Services.User
{
    public class UpdateUserService
    {
        private readonly ApplicationDbContext _context;

        public UpdateUserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Handle(int id, Models.User updatedUser)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return new NotFoundResult();

            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Email = updatedUser.Email;
            user.DateOfBirth = updatedUser.DateOfBirth;

            await _context.SaveChangesAsync();
            return new NoContentResult();
        }
    }
}
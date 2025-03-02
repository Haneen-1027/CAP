using Microsoft.AspNetCore.Mvc;
using CapApi.Data;

namespace CapApi.Services.User;

public class GetUserByIdService(ApplicationDbContext context)
{
    public async Task<IActionResult> Handle(int id)
    {
        var user = await context.Users.FindAsync(id);
        if (user == null)
            return new NotFoundResult();

        return new OkObjectResult(user);
    }
}
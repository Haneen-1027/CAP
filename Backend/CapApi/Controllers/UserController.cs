using CapApi.Models;
using CapApi.Services.User;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace CapApi.Controllers;

[ApiController]
//[Authorize(Roles = "Admin")]
[Route("users")]
[EnableCors("AllowOrigin")]
public class UserController(
    GetAllUsersService getAllUsersService,
    GetUserByIdService getUserByIdService,
    CreateUserService createUserService,
    UpdateUserService updateUserService,
    DeleteUserService deleteUserService)
    : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllUsers(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10,
        [FromQuery] string searchTerm = "",
        [FromQuery] string roleFilter = "",
        [FromQuery] string sortBy = "Id",
        [FromQuery] bool ascending = true)
    {
        try
        {
            return await getAllUsersService.Handle(
                page, 
                pageSize, 
                searchTerm, 
                roleFilter,
                sortBy,
                ascending);
        }
        catch (Exception ex)
        {
            return StatusCode(500,
                new { Message = "An error occurred while retrieving users.", Error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        try
        {
            return await getUserByIdService.Handle(id);
        }
        catch (Exception ex)
        {
            return StatusCode(500,
                new { Message = "An error occurred while retrieving the user.", Error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] User newUser)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            return await createUserService.Handle(newUser);
        }
        catch (Exception ex)
        {
            return StatusCode(500,
                new { Message = "An error occurred while creating the user.", Error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] User? updatedUser)
    {
        if (updatedUser == null || !ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            return await updateUserService.Handle(id, updatedUser);
        }
        catch (Exception ex)
        {
            return StatusCode(500,
                new { Message = "An error occurred while updating the user.", Error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            return await deleteUserService.Handle(id);
        }
        catch (Exception ex)
        {
            return StatusCode(500,
                new { Message = "An error occurred while deleting the user.", Error = ex.Message });
        }
    }
}
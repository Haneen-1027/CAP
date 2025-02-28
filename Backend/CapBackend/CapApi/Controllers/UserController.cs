using CapApi.Models;
using CapApi.Services.User;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace CapApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors("AllowOrigin")]
    public class UserController(
        GetAllUsersService getAllUsersService,
        GetUserByIdService getUserByIdService,
        CreateUserService createUserService,
        UpdateUserService updateUserService,
        DeleteUserService deleteUserService)
        : ControllerBase
    {
        private readonly GetAllUsersService _getAllUsersService = getAllUsersService;
        private readonly GetUserByIdService _getUserByIdService = getUserByIdService;
        private readonly CreateUserService _createUserService = createUserService;
        private readonly UpdateUserService _updateUserService = updateUserService;
        private readonly DeleteUserService _deleteUserService = deleteUserService;

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            return await _getAllUsersService.Handle();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            return await _getUserByIdService.Handle(id);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User newUser)
        {
            return await _createUserService.Handle(newUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            return await _updateUserService.Handle(id, updatedUser);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            return await _deleteUserService.Handle(id);
        }
    }
}

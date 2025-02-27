using Microsoft.AspNetCore.Mvc;
using webApi.Services.User;

namespace webApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly GetAllUsersService _getAllUsersService;
        private readonly GetUserByIdService _getUserByIdService;
        private readonly CreateUserService _createUserService;
        private readonly UpdateUserService _updateUserService;
        private readonly DeleteUserService _deleteUserService;

        public UserController(
            GetAllUsersService getAllUsersService,
            GetUserByIdService getUserByIdService,
            CreateUserService createUserService,
            UpdateUserService updateUserService,
            DeleteUserService deleteUserService)
        {
            _getAllUsersService = getAllUsersService;
            _getUserByIdService = getUserByIdService;
            _createUserService = createUserService;
            _updateUserService = updateUserService;
            _deleteUserService = deleteUserService;
        }

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
        public async Task<IActionResult> CreateUser([FromBody] webApi.Models.User newUser)
        {
            return await _createUserService.Handle(newUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] webApi.Models.User updatedUser)
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

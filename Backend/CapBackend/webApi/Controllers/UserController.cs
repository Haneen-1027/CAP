using Microsoft.AspNetCore.Mvc;
using webApi.Models;
namespace webApi.Controllers

{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        // Mocked list of users 
        private static readonly List<User> Users = new List<User>
        {
            new User { Id = 1, FirstName = "Mohammad", LastName = "Jury", Email = "mohammadjury@example.com", DateOfBirth = new DateTime(1990, 1, 1) },
            new User { Id = 2, FirstName = "Ayed", LastName = "Rabaya", Email = "ayedrabayaa@example.com", DateOfBirth = new DateTime(1995, 5, 15) }
        };

        // GET: api/User
        [HttpGet]
        public ActionResult<IEnumerable<User>> GetAllUsers()
        {
            return Ok(Users);
        }

        // GET: api/User/{id}
        [HttpGet("{id}")]
        public ActionResult<User> GetUserById(int id)
        {
            var user = Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST: api/User
        [HttpPost]
        public ActionResult<User> CreateUser([FromBody] User newUser)
        {
            if (newUser == null)
            {
                return BadRequest("User data is required.");
            }

            newUser.Id = Users.Count > 0 ? Users.Max(u => u.Id) + 1 : 1; // Assign a new ID
            Users.Add(newUser);

            return CreatedAtAction(nameof(GetUserById), new { id = newUser.Id }, newUser);
        }

        // PUT: api/User/{id}
        [HttpPut("{id}")]
        public ActionResult UpdateUser(int id, [FromBody] User updatedUser)
        {
            var user = Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }

            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Email = updatedUser.Email;
            user.DateOfBirth = updatedUser.DateOfBirth;
            
            return NoContent();
        }

        // DELETE: api/User/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteUser(int id)
        {
            var user = Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }

            Users.Remove(user);
            return NoContent();
        }
    }
}

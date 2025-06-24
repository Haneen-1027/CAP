using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CapApi.Dtos.User;

public class UserUpdateDto
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Username { get; set; }

    [Required]
    [StringLength(100)]
    public string FirstName { get; set; }

    [Required]
    [StringLength(100)]
    public string LastName { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    public string Role { get; set; }
    public DateTime DateOfBirth { get; set; }
    
    // Explicitly exclude these from binding
    [JsonIgnore]
    public DateTime CreatedAt { get; set; }
    [JsonIgnore]
    public DateTime UpdatedAt { get; set; }
}
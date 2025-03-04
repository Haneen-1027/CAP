using System.ComponentModel.DataAnnotations;

namespace CapApi.Dtos.User;

public class SignUpDto
{
    [MaxLength(100)]
    public string? Username { get; set; }
    [MaxLength(100)]
    public string? FirstName { get; set; }
    [MaxLength(100)]
    public string? LastName { get; set; }
    [MaxLength(100)]
    public string? Email { get; set; }
    [MaxLength(100)]
    public string? Password { get; set; } 
    public DateTime DateOfBirth { get; set; }
}
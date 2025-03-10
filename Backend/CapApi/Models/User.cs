using System.ComponentModel.DataAnnotations;

namespace CapApi.Models;

public class User
{
    public int Id { get; init; }
    [MaxLength(100)] public string? Username { get; init; }
    [MaxLength(100)] public string? FirstName { get; set; }
    [MaxLength(100)] public string? LastName { get; set; }
    [MaxLength(100)] public string? Role { get; init; }
    [MaxLength(100)] public string? Email { get; set; }
    [MaxLength(100)] public string? Password { get; set; }
    public DateTime DateOfBirth { get; set; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
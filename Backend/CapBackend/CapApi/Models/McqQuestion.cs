
using System.ComponentModel.DataAnnotations;

namespace CapApi.Models;

public class McqQuestion
{
    public int Id { get; init; }
    public int QuestionId { get; init; }
    public Question? Question { get; init; }
    public bool? IsTrueFalse { get; set; }
    [MaxLength(100)]
    public string? CorrectAnswer { get; set; }
    public DateTime? CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
    public List<string?>? WrongOptions { get; set; }
}
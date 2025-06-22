using System.ComponentModel.DataAnnotations;

namespace CapApi.Models;

public class Submission
{
    public int Id { get; init; }
    public int AssessmentId { get; init; }
    public int QuestionId { get; init; }
    public int UserId { get; init; }
    public Assessment Assessment { get; init; }
    public Question Question { get; init; }
    public User User { get; init; }
    [MaxLength(5000)]
    public string? Answer { get; init; }
    
    public DateTime StartedAt { get; init; }
    public DateTime SubmittedAt { get; init; }
    
    public decimal? Mark { get; set; } // Nullable decimal for the mark
}
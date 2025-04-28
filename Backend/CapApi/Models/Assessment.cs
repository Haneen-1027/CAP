using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CapApi.Models;

public class Assessment
{
    public int Id { get; init; }
    [MaxLength(100)] public string? Name { get; set; }
    public TimeSpan Duration { get; set; }
    [Column("AssessmentDate")] public DateTime AssessmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int TotalMark { get; set; }
    public int QuestionsCount { get; set; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public List<AssessmentQuestion> AssessmentQuestions { get; init; } = [];
    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
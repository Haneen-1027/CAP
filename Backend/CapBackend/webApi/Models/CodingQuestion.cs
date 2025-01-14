namespace webApi.Models;

public class CodingQuestion
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string Prompt { get; set; }
    public string Language { get; set; } // Programming language
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Question Question { get; set; }
}
namespace webApi.Models;

public class MCQQuestion
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string Prompt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Question Question { get; set; }
    public ICollection<Option> Options { get; set; }
}
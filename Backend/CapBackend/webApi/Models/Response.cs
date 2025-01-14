namespace webApi.Models;

public class Response
{
    public int Id { get; set; }
    public int AssignmentId { get; set; }
    public int QuestionId { get; set; }
    public string Answer { get; set; }
    public int? Score { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Question Question { get; set; }
}
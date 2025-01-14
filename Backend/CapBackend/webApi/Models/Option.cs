namespace webApi.Models;

public class Option
{
    public int Id { get; set; }
    public int MCQQuestionId { get; set; }
    public string Text { get; set; }
    public bool IsCorrect { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public MCQQuestion MCQQuestion { get; set; }
}

namespace webApi.Models;

public class Question
{
    public int Id { get; set; }
    public int AssessmentId { get; set; }
    public string Type { get; set; } // MCQ, Essay, Coding
    public int MaxScore { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Assessment Assessment { get; set; }
    public MCQQuestion MCQQuestion { get; set; }
    public EssayQuestion EssayQuestion { get; set; }
    public CodingQuestion CodingQuestion { get; set; }
}
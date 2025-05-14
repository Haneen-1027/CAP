namespace CapApi.Dtos.Submission;

public class SubmissionDto
{
    public int SubmissionId { get; set; }
    public int QuestionId { get; set; }
    public string QuestionText { get; set; }
    public string QuestionType { get; set; }
    public string Answer { get; set; }
    public int Mark { get; set; }
    public int MaxMark { get; set; }
    public DateTime SubmittedAt { get; set; }
    public List<string> WrongOptions { get; set; }
}
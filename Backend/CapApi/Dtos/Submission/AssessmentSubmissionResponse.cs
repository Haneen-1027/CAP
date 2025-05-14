namespace CapApi.Dtos.Submission;

public class AssessmentSubmissionResponse
{
    public int UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int TotalMarks { get; set; }
    public int SubmissionCount { get; set; }
    public DateTime LastSubmittedAt { get; set; }
    public List<SubmissionDto> Submissions { get; set; }
}
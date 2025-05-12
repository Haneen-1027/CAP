namespace CapApi.Dtos.Submission;

public class AssessmentSubmissionDto
{
    public int assessment_id { get; set; }
    public int user_id { get; set; }  // Add this line
    public List<AnswerDto> Answers { get; set; }
    public bool submitted { get; set; }
    public DateTime started_time { get; set; }
    public DateTime submitted_time { get; set; }
}
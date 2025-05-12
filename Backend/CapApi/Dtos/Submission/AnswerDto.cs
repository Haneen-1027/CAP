namespace CapApi.Dtos.Submission;

public class AnswerDto
{
    public int question_id { get; set; }
    public string contributor_answer { get; set; }
    public string question_type { get; set; }
    
    // For coding questions
    public int? test_pass { get; set; }
    public int? total_test_case { get; set; }
}
using CapApi.Dtos.Question;

namespace CapApi.Dtos.Submission;

public class AnswerDto
{
    public int question_id { get; set; }
    public string contributor_answer { get; set; }
    public string question_type { get; set; }
    
    // For coding questions
    public int? test_pass { get; set; }
    public int? total_test_case { get; set; }

    public string? prompt { get; set; }
    //public QuestionDetailsDto? question_details { get; set; }
    public object? question_details { get; set; }
    public int? new_mark { get; set; }
    public int? total_mark { get; set; }
}
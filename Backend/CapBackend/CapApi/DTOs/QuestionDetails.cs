namespace CapApi.DTOs;

public class QuestionDetails
{
    public bool? IsTrueFalse { get; set; }
    public string? CorrectAnswer { get; set; }  // Nullable for essay and coding
    public List<string>? WrongOptions { get; set; }  // Nullable for essay and coding
    public List<TestCaseRequest>? TestCases { get; set; }  // Required only for coding
}
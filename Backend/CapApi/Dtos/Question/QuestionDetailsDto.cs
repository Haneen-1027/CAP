namespace CapApi.Dtos.Question;

public class QuestionDetailsDto
{
    public List<string>? CorrectAnswer { get; set; }
    public bool? IsTrueFalse { get; set; }
    public int OptionsCount { get; set; }
    public List<string>? WrongOptions { get; set; }
    public int? InputsCount { get; set; }
    public string? Description { get; set; }
    public List<TestCaseDto>? TestCases { get; set; }
}
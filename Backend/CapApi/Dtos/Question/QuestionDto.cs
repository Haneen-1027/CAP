namespace CapApi.Dtos.Question;

public record QuestionDto(
    int Id,
    string? Type,
    string? Category,
    string? Prompt,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    object? Details
)
{
    public static QuestionDto FromModel(Models.Question question)
    {
        object? details = question.Type switch
        {
            "mc" => question.McqQuestion is not null
                ? new
                {
                    question.McqQuestion.IsTrueFalse,
                    question.McqQuestion.CorrectAnswer,
                    WrongOptions = question.McqQuestion.WrongOptions ?? []
                }
                : null,
            "coding" => question.CodingQuestion is not null
                ? new
                {
                    question.CodingQuestion.InputsCount,
                    question.CodingQuestion.Description,
                    TestCases = question.CodingQuestion.TestCases
                        .Select(tc => new { tc?.Inputs, tc?.ExpectedOutput })
                        .ToList()
                }
                : null,
            "essay" => new { }, // Empty object for essay
            _ => null
        };

        return new QuestionDto(
            question.Id,
            question.Type,
            question.Category,
            question.Prompt,
            question.CreatedAt,
            question.UpdatedAt,
            details
        );
    }
}
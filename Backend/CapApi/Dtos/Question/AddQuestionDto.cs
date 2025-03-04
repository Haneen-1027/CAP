using System.ComponentModel.DataAnnotations;

namespace CapApi.Dtos.Question;

public class AddQuestionDto
{
    [Required] public string Type { get; set; } = string.Empty;
    [Required] public string Prompt { get; set; } = string.Empty;
    [Required] public string Category { get; set; } = string.Empty;
    public QuestionDetailsDto? Details { get; set; }
}
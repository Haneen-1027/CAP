namespace CapApi.DTOs;

public class AddQuestionDto
{
    public string? Type { get; set; }
    public string? Prompt { get; set; }
    public string? Category { get; set; }
    public Dictionary<string, object>? Details { get; set; } 
}
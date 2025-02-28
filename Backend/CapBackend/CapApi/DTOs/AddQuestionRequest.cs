namespace CapApi.DTOs;

public class AddQuestionRequest
{
    public string? Type { get; set; }
    //public float Mark { get; set; }
    public string? Prompt { get; set; }
    public string? Category { get; set; }
    public Dictionary<string, object>? Details { get; set; } // Handles MCQ, Coding, and Essay details dynamically
}
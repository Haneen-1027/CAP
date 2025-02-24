namespace webApi.DTOs;

public class CategoryRequest
{
    public string? Category { get; set; }
    public string? Type { get; set; }  // Optional: If specified, filter by this type.
    public int NumberOfQuestions { get; set; } = 10;  // Default to 10 per page
    public int PageNumber { get; set; } = 1;  // Default to page 1
}
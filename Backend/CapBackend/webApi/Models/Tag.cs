namespace webApi.Models;

public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int CategoryId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public TagCategory Category { get; set; }
    public ICollection<AssessmentTag> AssessmentTags { get; set; }
}
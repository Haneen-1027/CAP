namespace webApi.Models;

public class Assessment
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int CreatedBy { get; set; }
    public int OrganizationId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public User Creator { get; set; }
    public Organization Organization { get; set; }
    public ICollection<Question> Questions { get; set; }
}
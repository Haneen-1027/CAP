namespace webApi.Models;
public class Candidate
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string ProfileDetails { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public User User { get; set; }
    public ICollection<OrganizationCandidate> OrganizationCandidates { get; set; }
}
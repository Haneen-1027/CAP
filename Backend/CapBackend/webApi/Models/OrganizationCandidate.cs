namespace webApi.Models;

public class OrganizationCandidate
{
    public int Id { get; set; }
    public int OrganizationId { get; set; }
    public int CandidateId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Organization Organization { get; set; }
    public Candidate Candidate { get; set; }
}
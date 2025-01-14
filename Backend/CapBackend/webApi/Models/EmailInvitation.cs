namespace webApi.Models;

public class EmailInvitation
{
    public int Id { get; set; }
    public int OrganizationId { get; set; }
    public string Email { get; set; }
    public string Token { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public Organization Organization { get; set; }
}
namespace webApi.Models;

public class AuditLog
{
    public int Id { get; set; }
    public string Action { get; set; }
    public string Details { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public User User { get; set; }
}
namespace webApi.Models;

using Microsoft.EntityFrameworkCore;

public class CAP_Context : DbContext
{
    public CAP_Context(DbContextOptions<CAP_Context> options) : base(options) { }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
    public DbSet<Assessment> Assessments { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<MCQQuestion> MCQQuestions { get; set; }
    public DbSet<EssayQuestion> EssayQuestions { get; set; }
    public DbSet<CodingQuestion> CodingQuestions { get; set; }
    public DbSet<Option> Options { get; set; }
    public DbSet<Candidate> Candidates { get; set; }
    public DbSet<OrganizationCandidate> OrganizationCandidates { get; set; }
    public DbSet<Recruiter> Recruiters { get; set; }
    public DbSet<Response> Responses { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<TagCategory> TagCategories { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<AdminSettings> AdminSettings { get; set; }
    public DbSet<AssessmentReport> AssessmentReports { get; set; }
    public DbSet<EmailInvitation> EmailInvitations { get; set; }
    public DbSet<AssessmentActionType> AssessmentActionTypes { get; set; }
    public DbSet<Notification> Notifications { get; set; }
}

using CapApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Data;

public class CapDbContext : DbContext
{
    public CapDbContext(DbContextOptions<CapDbContext> options) : base(options)
    {
    }

    public DbSet<Question> Questions { get; set; }
    public DbSet<McqQuestion> McqQuestions { get; set; }
    public DbSet<CodingQuestion> CodingQuestions { get; set; }
    public DbSet<EssayQuestion> EssayQuestions { get; set; }
    public DbSet<Assessment> Assessments { get; set; }
    public DbSet<AssessmentQuestion> AssessmentQuestions { get; set; }
    public DbSet<TestCase> TestCases { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Submission> Submissions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AssessmentQuestion>()
            .HasKey(aq => new { aq.AssessmentId, aq.QuestionId });

        modelBuilder.Entity<AssessmentQuestion>()
            .HasOne(aq => aq.Assessment)
            .WithMany(a => a.AssessmentQuestions)
            .HasForeignKey(aq => aq.AssessmentId);

        modelBuilder.Entity<AssessmentQuestion>()
            .HasOne(aq => aq.Question)
            .WithMany(q => q.AssessmentQuestions)
            .HasForeignKey(aq => aq.QuestionId);

        modelBuilder.Entity<TestCase>()
            .HasOne(tc => tc.CodingQuestion)
            .WithMany(cq => cq.TestCases)
            .HasForeignKey(tc => tc.CodingQuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Configure Submission relationships
        modelBuilder.Entity<Submission>()
            .HasOne(s => s.Assessment)
            .WithMany(a => a.Submissions)
            .HasForeignKey(s => s.AssessmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Submission>()
            .HasOne(s => s.Question)
            .WithMany(q => q.Submissions)
            .HasForeignKey(s => s.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Submission>()
            .HasOne(s => s.User)
            .WithMany(u => u.Submissions)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
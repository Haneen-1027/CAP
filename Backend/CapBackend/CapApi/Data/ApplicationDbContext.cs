using CapApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Question> Questions { get; set; }
        public DbSet<McqQuestion> MCQQuestions { get; set; }
        public DbSet<CodingQuestion> CodingQuestions { get; set; }
        public DbSet<EssayQuestion> EssayQuestions { get; set; }
        public DbSet<Assessment> Assessments { get; set; }
        public DbSet<AssessmentQuestion> AssessmentQuestions { get; set; }
        public DbSet<TestCase> TestCases { get; set; }
        public DbSet<User> Users { get; set; }


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

            // Optional: Configure the User entity (e.g., adding unique constraints)
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();  // Example of adding a unique constraint on Email
        }
    }
}
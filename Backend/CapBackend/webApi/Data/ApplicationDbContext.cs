using Microsoft.EntityFrameworkCore;
using webApi.Models;

namespace webApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Question> Questions { get; set; }
        public DbSet<MCQQuestion> MCQQuestions { get; set; }
        public DbSet<CodingQuestion> CodingQuestions { get; set; }
        public DbSet<EssayQuestion> EssayQuestions { get; set; }

        public DbSet<Assessment> Assessments { get; set; }
        //public DbSet<AssessmentQuestion> AssessmentQuestions { get; set; }
        //public ApplicationDbContext() { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Assessment>()
                .HasMany(a => a.Questions)
                .WithMany(q => q.Assessments)
                .UsingEntity<AssessmentQuestion>(
                    j => j.HasOne(assessmentQuestion => assessmentQuestion.Question)
                        .WithMany(question => question.AssessmentQuestion)
                        .HasForeignKey(assessmentQuestion => assessmentQuestion.QuestionId),
                    j => j.HasOne(assessmentQuestion => assessmentQuestion.Assessment)
                        .WithMany(assessment => assessment.AssessmentQuestion)
                        .HasForeignKey(assessmentQuestion => assessmentQuestion.AssessmentId),
                    j => { j.ToTable("AssessmentsQuestions"); });
        }
    }

}

namespace CapApi.DTOs
{
    public class AssessmentAttemptDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int AssessmentId { get; set; }
        public string AssessmentName { get; set; }
        public int QuestionCount { get; set; }
        public DateTime SubmittedAt { get; set; }
        public decimal? Mark { get; set; }
    }
}
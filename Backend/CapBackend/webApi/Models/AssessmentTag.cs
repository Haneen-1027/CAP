namespace webApi.Models;
    public class AssessmentTag
    {
        public int Id { get; set; }
        public int TestId { get; set; }
        public int TagId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }


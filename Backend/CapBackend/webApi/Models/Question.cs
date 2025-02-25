namespace webApi.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Type { get; set; }  // "mc", "coding", "essay"
        public string Category { get; set; }
        public string Prompt { get; set; }
        //public float Mark { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation Properties
        public MCQQuestion? MCQQuestion { get; set; }
        public CodingQuestion? CodingQuestion { get; set; }
        public EssayQuestion? EssayQuestion { get; set; }
        //public List<AssessmentQuestion> AssessmentQuestions { get; set; }
        public List<AssessmentQuestion> AssessmentQuestions { get; set; } = new();
        //public ICollection<AssessmentQuestion> AssessmentQuestion { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace CapApi.Models
{
    public class Question
    {
        public int Id { get; set; }
        [MaxLength(100)]
        public string? Type { get; set; }  // "mc", "coding", "essay"
        [MaxLength(100)]
        public string? Category { get; set; }
        [MaxLength(100)]
        public string? Prompt { get; set; }
        public DateTime CreatedAt { get; init; }
        public DateTime UpdatedAt { get; set; }

        public McqQuestion? McqQuestion { get; set; }
        public CodingQuestion? CodingQuestion { get; set; }
        public EssayQuestion? EssayQuestion { get; set; }
        public List<AssessmentQuestion>? AssessmentQuestions { get; init; } = [];
    }
}

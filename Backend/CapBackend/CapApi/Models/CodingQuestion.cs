using System.ComponentModel.DataAnnotations;

namespace CapApi.Models
{
    public class CodingQuestion
    {
        public int Id { get; init; }
        public int QuestionId { get; init; }
        public int InputsCount { get; set; }
        
        [MaxLength(100)]
        public string? Description { get; set; }
        public Question? Question { get; init; }
        public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public List<TestCase> TestCases { get; set; } = [];
    }
}

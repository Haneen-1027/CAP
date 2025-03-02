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
        public List<TestCase> TestCases { get; set; } = [];
    }
}

using System.ComponentModel.DataAnnotations;

namespace CapApi.Models
{
    public class TestCase
    {
        public int Id { get; init; }
        public List<Input> Inputs { get; init; }
        [MaxLength(1000)]
        public string? ExpectedOutput { get; init; }
        public int CodingQuestionId { get; init; }
        public CodingQuestion? CodingQuestion { get; init; }
    }
    public class Input
    {
        public string Value { get; set; } = string.Empty; 
        public string Type { get; set; } = string.Empty; 
    }

}

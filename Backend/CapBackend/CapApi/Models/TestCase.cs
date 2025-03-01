using System.ComponentModel.DataAnnotations;

namespace CapApi.Models
{
    public class TestCase
    {
        public int Id { get; init; }
        public List<string>? Inputs { get; init; }
        [MaxLength(1000)]
        public string? ExpectedOutput { get; init; }
        public int CodingQuestionId { get; init; }
        public CodingQuestion? CodingQuestion { get; init; }
    }

}

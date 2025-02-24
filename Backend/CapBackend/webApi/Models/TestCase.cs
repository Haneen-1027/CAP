namespace webApi.Models
{
    public class TestCase
    {
        public int Id { get; set; }
        public List<string> Inputs { get; set; }
        public string ExpectedOutput { get; set; }

        // Foreign key for CodingQuestion
        public int CodingQuestionId { get; set; }
        public CodingQuestion CodingQuestion { get; set; }
    }

}

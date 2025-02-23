namespace webApi.Models;

    public class TestCase
    {
        public int Id { get; set; }
        public int CodingQuestionId { get; set; }
        public List<string> Inputs { get; set; }
        public string ExpectedOutput { get; set; }
    }


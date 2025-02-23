namespace webApi.Models;

    public class MCQQuestion
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public Question Question { get; set; }
        public bool? IsTrueFalse { get; set; }
        public string? CorrectAnswer { get; set; }
        public List<string>? WrongOptions { get; set; }
    }

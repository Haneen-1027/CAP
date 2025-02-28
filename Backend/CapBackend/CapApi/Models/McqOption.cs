namespace CapApi.Models
{
    public class McqOption
    {
        public int Id { get; set; }
        public int McqQuestionId { get; set; }
        public string? Text { get; set; }
        public bool IsCorrect { get; set; }
    }
}
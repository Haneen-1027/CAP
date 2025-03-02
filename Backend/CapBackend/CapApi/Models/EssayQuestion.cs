namespace CapApi.Models
{
    public class EssayQuestion
    {
        public int Id { get; init; }
        public int QuestionId { get; init; }
        public Question? Question { get; init; }
        public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

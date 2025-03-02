namespace CapApi.Models
{
    public class EssayQuestion
    {
        public int Id { get; init; }
        public int QuestionId { get; init; }
        public Question? Question { get; set; }
    }
}

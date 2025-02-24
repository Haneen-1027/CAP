namespace webApi.Models
{
    public class EssayQuestion
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public Question Question { get; set; }
    }
}

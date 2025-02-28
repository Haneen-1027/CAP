namespace CapApi.Models
{
    public class AssessmentQuestion
    {
        public int AssessmentId { get; init; }
        public Assessment? Assessment { get; init; }

        public int QuestionId { get; init; }
        public Question? Question { get; init; }

        public int Mark { get; init; }
    }

}

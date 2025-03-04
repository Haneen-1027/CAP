using CapApi.Dtos.Question;

namespace CapApi.DTOs.Assessment
{
    public class AddAssessmentDto
    {
        public string? Name { get; set; }
        public string? Duration { get; set; }
        public string? AssessmentDate { get; set; }
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
        public int TotalMark { get; set; }
        public int QuestionsCount { get; set; }
        public List<QuestionMarkDto>? QuestionsIds { get; set; }
    }


}
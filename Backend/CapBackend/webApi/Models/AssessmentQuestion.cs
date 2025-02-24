using webApi.Models;

namespace webApi.Models
{
    public class AssessmentQuestion
    {
        public int AssessmentId { get; set; }
        public Assessment Assessment { get; set; }

        public int QuestionId { get; set; }
        public Question Question { get; set; }

        public int Mark { get; set; } // Stores the mark assigned to this question in the assessment
    }

}

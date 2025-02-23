using System.ComponentModel.DataAnnotations;

namespace webApi.DTOs
{
    public class CreateAssessmentDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Duration { get; set; } // Format "HH:mm"

        [Required]
        public string AssessmentDate { get; set; } // Date in "yyyy-MM-dd" format

        [Required]
        public string StartTime { get; set; } // Format "HH:mm"

        [Required]
        public string EndTime { get; set; } // Format "HH:mm"

        [Required]
        public int TotalMark { get; set; }

        [Required]
        public int QuestionsCount { get; set; }

        [Required]
        public List<QuestionMarkDto> QuestionsIds { get; set; }
    }


}
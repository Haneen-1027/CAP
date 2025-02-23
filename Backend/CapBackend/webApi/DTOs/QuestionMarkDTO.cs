using System.ComponentModel.DataAnnotations;

namespace webApi.DTOs
{
    public class QuestionMarkDto
    {
        [Required]
        public int Id { get; set; }  // Question ID

        [Required]
        public int Mark { get; set; } // Mark for the question
    }
}

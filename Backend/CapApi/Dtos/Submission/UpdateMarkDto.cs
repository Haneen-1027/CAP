using System.ComponentModel.DataAnnotations;

namespace CapApi.DTOs
{
    public class UpdateMarkDto
    {
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public int AssessmentId { get; set; }
        
        [Required]
        public int QuestionId { get; set; }
        
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Mark must be a positive number")]
        public decimal Mark { get; set; }
    }
}
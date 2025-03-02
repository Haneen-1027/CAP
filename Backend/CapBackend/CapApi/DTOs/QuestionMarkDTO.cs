using System.ComponentModel.DataAnnotations;

namespace CapApi.DTOs
{
    public class QuestionMarkDto
    
    {
        [Required]
        public int Id { get; set; } 

        [Required]
        public int Mark { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace CapApi.DTOs
{
    public abstract class QuestionMarkDto
    
    {
        [Required]
        public int Id { get; set; } 

        [Required]
        public int Mark { get; set; }
    }
}
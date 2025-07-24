using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CapApi.Models;

public class TestCase
{
    public int Id { get; init; }
    
    [MaxLength(50)]
    public string? Type { get; init; }  // New nullable column for input type
    
    public List<string>? Inputs { get; init; }
    
    [MaxLength(1000)] 
    public string? ExpectedOutput { get; init; }
    
    public int CodingQuestionId { get; init; }
    public CodingQuestion? CodingQuestion { get; init; }
}
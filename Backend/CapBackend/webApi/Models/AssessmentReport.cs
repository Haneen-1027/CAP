namespace webApi.Models;

public class AssessmentReport
{
    public int Id { get; set; }
    public int AssessmentId { get; set; }
    public string ReportData { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Assessment Assessment { get; set; }
}
namespace CapApi.Dtos.Code;

public class TestCaseResultDto
{
    public List<string>? Inputs { get; set; }
    public string? ExpectedOutput { get; set; }
    public string? ActualOutput { get; set; }
    public string? Error { get; set; }
    public bool IsPassed { get; set; }
    public decimal ExecutionTime { get; set; }
}
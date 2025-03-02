namespace CapApi.DTOs;

public class TestCaseRequest
{
    public List<string>? Inputs { get; set; }
    public string? ExpectedOutput { get; set; }
}
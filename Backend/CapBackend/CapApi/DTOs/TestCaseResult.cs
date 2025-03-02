namespace CapApi.DTOs
{
    public class TestCaseResult
    {
        public List<string>? Inputs { get; set; }
        public string? ExpectedOutput { get; set; }
        public string? ActualOutput { get; set; }
        public string? Error { get; set; }
    }
}

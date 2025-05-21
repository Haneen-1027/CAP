namespace CapApi.Dtos.Submission;

public class TestCaseResultDto
{
    public int test_case_id { get; set; }
    public bool passed { get; set; }
    public string expected_output { get; set; }
    public string actual_output { get; set; }
}
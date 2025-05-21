using CapApi.Data;
using CapApi.Dtos.Submission;
using CapApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssessmentSubmissionsController : ControllerBase
{
    private readonly CapDbContext _context;

    public AssessmentSubmissionsController(CapDbContext context)
    {
        _context = context;
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitAssessment([FromBody] List<AssessmentSubmissionRequest> submissions)
    {
        if (submissions == null || !submissions.Any())
            return BadRequest("No submission data provided.");

        foreach (var sub in submissions)
        {
            var user = await _context.Users.FindAsync(sub.user_id);
            if (user == null)
                return NotFound($"User with ID {sub.user_id} not found.");

            var assessment = await _context.Assessments.FindAsync(sub.assessment_id);
            if (assessment == null)
                return NotFound($"Assessment with ID {sub.assessment_id} not found.");

            foreach (var ans in sub.Answers)
            {
                var submission = new Submission
                {
                    UserId = sub.user_id,
                    AssessmentId = sub.assessment_id,
                    QuestionId = ans.question_id,
                    Answer = ans.contributor_answer,
                    StartedAt = sub.started_time,
                    SubmittedAt = sub.submitted_time,
                    Mark = ans.new_mark >= 0 ? ans.new_mark : null
                };

                _context.Submissions.Add(submission);
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Submission recorded successfully." });
    }
}

// DTO to match frontend structure
public class AssessmentSubmissionRequest
{
    public int user_id { get; set; }
    public string username { get; set; } = string.Empty;
    public string firstName { get; set; } = string.Empty;
    public string lastName { get; set; } = string.Empty;
    public int assessment_id { get; set; }
    public List<FrontendAnswerDto> Answers { get; set; } = [];
    public DateTime started_time { get; set; }
    public DateTime submitted_time { get; set; }
}

public class FrontendAnswerDto
{
    public int question_id { get; set; }
    public string prompt { get; set; } = string.Empty;
    public string contributor_answer { get; set; } = string.Empty;
    public QuestionDetails question_details { get; set; } = new();
    public int new_mark { get; set; }
    public int total_mark { get; set; }
}

public class QuestionDetails
{
    public string question_type { get; set; } = string.Empty;
    public List<string>? visible_options { get; set; }
    public int? used_langauage { get; set; }
    public TestCases? test_cases { get; set; }
}

public class TestCases
{
    public List<string>? tests_parameters { get; set; }
    public List<string>? excpected_output { get; set; }
    public int tests_count { get; set; }
    public int test_passed { get; set; }
}

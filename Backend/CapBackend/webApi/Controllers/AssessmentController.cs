using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webApi.Data;
using webApi.DTOs;
using webApi.Models;

namespace webApi.Controllers;

[ApiController]
[Route("api/assessments")]
public class AssessmentsController(ApplicationDbContext context) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    [HttpPost("create")]
    public async Task<IActionResult> CreateAssessment([FromBody] CreateAssessmentDto? dto)
    {
        if (dto?.QuestionsIds == null || !dto.QuestionsIds.Any())
        {
            return BadRequest(new { Message = "Invalid request. Ensure all required fields are provided." });
        }

        var questionIds = dto.QuestionsIds.Select(q => q.Id).ToList();
        var questions = await _context.Questions.Where(q => questionIds.Contains(q.Id)).ToListAsync();

        if (questions.Count != dto.QuestionsIds.Count)
        {
            return BadRequest(new { Message = "One or more questions not found in the database." });
        }

        if (!TimeSpan.TryParse(dto.Duration, out var duration) ||
            !DateTime.TryParse(dto.AssessmentDate, out var assessmentDate) ||
            !TimeSpan.TryParse(dto.StartTime, out var startTime) ||
            !TimeSpan.TryParse(dto.EndTime, out var endTime))
        {
            return BadRequest(new { Message = "Invalid date/time format." });
        }

        var assessment = new Assessment
        {
            Name = dto.Name,
            Duration = duration,
            AssessmentDate = assessmentDate,
            StartTime = startTime,
            EndTime = endTime,
            TotalMark = dto.TotalMark,
            QuestionsCount = dto.QuestionsCount,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Assessments.Add(assessment);
        await _context.SaveChangesAsync();

        var assessmentQuestions = dto.QuestionsIds.Select(q => new AssessmentQuestion
        {
            AssessmentId = assessment.Id,
            QuestionId = q.Id,
            Mark = q.Mark
        }).ToList();

        _context.AssessmentQuestions.AddRange(assessmentQuestions);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Assessment created successfully", AssessmentId = assessment.Id });
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllAssessments()
    {
        var assessments = await _context.Assessments
            .Include(a => a.AssessmentQuestions)
            .ThenInclude(aq => aq.Question)
            .ToListAsync();

        var assessmentDto = assessments.Select(a => new
        {
            a.Id,
            a.Name,
            Duration = a.Duration.ToString(),
            Time = a.AssessmentDate.ToString("yyyy-MM-dd HH:mm:ss"),
            StartTime = a.StartTime.ToString(),
            EndTime = a.EndTime.ToString(),
            a.TotalMark,
            a.QuestionsCount,
            Questions = a.AssessmentQuestions.Select(aq => new
            {
                aq.QuestionId,
                aq.Question.Prompt,
                aq.Mark
            })
        });

        return Ok(assessmentDto);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAssessmentById(int id)
    {
        var assessment = await _context.Assessments
            .Include(a => a.AssessmentQuestions)
            .ThenInclude(aq => aq.Question)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (assessment == null)
        {
            return NotFound(new { Message = "Assessment not found." });
        }

        return Ok(new
        {
            assessment.Id,
            assessment.Name,
            Duration = assessment.Duration.ToString(),
            Time = assessment.AssessmentDate.ToString("yyyy-MM-dd HH:mm:ss"),
            StartTime = assessment.StartTime.ToString(),
            EndTime = assessment.EndTime.ToString(),
            assessment.TotalMark,
            assessment.QuestionsCount,
            Questions = assessment.AssessmentQuestions.Select(aq => new
            {
                aq.QuestionId,
                aq.Question.Prompt,
                aq.Mark
            })
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAssessment(int id, [FromBody] UpdateAssessmentDto? dto)
    {
        var assessment = await _context.Assessments
            .Include(a => a.AssessmentQuestions)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (assessment == null)
        {
            return NotFound(new { Message = "Assessment not found." });
        }

        if (dto?.QuestionsIds == null || !dto.QuestionsIds.Any())
        {
            return BadRequest(new { Message = "Invalid request. Ensure all required fields are provided." });
        }

        var providedQuestionIds = dto.QuestionsIds.Select(q => q.Id).ToList();
        var existingQuestionIds = await _context.Questions
            .Where(q => providedQuestionIds.Contains(q.Id))
            .Select(q => q.Id)
            .ToListAsync();

        var invalidIds = providedQuestionIds.Except(existingQuestionIds).ToList();
        if (invalidIds.Any())
        {
            return BadRequest(new { Message = $"Invalid Question IDs: {string.Join(", ", invalidIds)}" });
        }

        if (!TimeSpan.TryParse(dto.Duration, out var duration) ||
            !DateTime.TryParse(dto.Time, out var assessmentDate) ||
            !TimeSpan.TryParse(dto.StartTime, out var startTime) ||
            !TimeSpan.TryParse(dto.EndTime, out var endTime))
        {
            return BadRequest(new { Message = "Invalid date/time format." });
        }

        assessment.Name = dto.Name;
        assessment.Duration = duration;
        assessment.AssessmentDate = assessmentDate;
        assessment.StartTime = startTime;
        assessment.EndTime = endTime;
        assessment.TotalMark = dto.TotalMark;
        assessment.QuestionsCount = dto.QuestionsCount;
        assessment.UpdatedAt = DateTime.UtcNow;

        _context.AssessmentQuestions.RemoveRange(assessment.AssessmentQuestions);

        var newAssessmentQuestions = dto.QuestionsIds.Select(q => new AssessmentQuestion
        {
            AssessmentId = assessment.Id,
            QuestionId = q.Id,
            Mark = q.Mark
        }).ToList();

        await _context.AssessmentQuestions.AddRangeAsync(newAssessmentQuestions);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Assessment updated successfully." });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAssessment(int id)
    {
        var assessment = await _context.Assessments
            .Include(a => a.AssessmentQuestions)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (assessment == null)
        {
            return NotFound(new { Message = "Assessment not found." });
        }

        _context.AssessmentQuestions.RemoveRange(assessment.AssessmentQuestions);
        _context.Assessments.Remove(assessment);

        await _context.SaveChangesAsync();

        return Ok(new { Message = "Assessment deleted successfully." });
    }
}

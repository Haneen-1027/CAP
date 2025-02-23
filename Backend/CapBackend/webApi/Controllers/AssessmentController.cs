using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using webApi.Data;
using webApi.DTOs;
using webApi.Models;

[Route("api/[controller]")]
[ApiController]
public class AssessmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AssessmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateAssessment([FromBody] CreateAssessmentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Convert string time inputs to proper types
        if (!TimeSpan.TryParse(dto.Duration, out TimeSpan duration) ||
            !TimeSpan.TryParse(dto.StartTime, out TimeSpan startTime) ||
            !TimeSpan.TryParse(dto.EndTime, out TimeSpan endTime) ||
            !DateTime.TryParse(dto.AssessmentDate, out DateTime date))
        {
            return BadRequest("Invalid date or time format.");
        }

        // Validate that the questions exist
        var questionIds = dto.QuestionsIds.Select(q => q.Id).ToList();
        var existingQuestions = await _context.Questions
            .Where(q => questionIds.Contains(q.Id))
            .Select(q => q.Id)
            .ToListAsync();

        if (existingQuestions.Count != dto.QuestionsIds.Count)
            return BadRequest("Some question IDs do not exist.");

        // Create assessment
        var assessment = new Assessment
        {
            Name = dto.Name,
            Duration = duration,
            AssessmentDate = date,
            StartTime = startTime,
            EndTime = endTime,
            TotalMark = dto.TotalMark,
            QuestionsCount = dto.QuestionsCount,
            //AssessmentQuestions = dto.QuestionsIds.Select(q => new AssessmentQuestion
            //{
            //    QuestionId = q.Id,
            //    Mark = q.Mark
            //}).ToList()
        };

        _context.Assessments.Add(assessment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Assessment created successfully", assessmentId = assessment.Id });
    }
}

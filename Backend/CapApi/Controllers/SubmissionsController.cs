using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CapApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using CapApi.Models;
using CapApi.DTOs;
using CapApi.Dtos.Submission;
using System.ComponentModel.DataAnnotations;

namespace CapApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubmissionsController : ControllerBase
    {
        private readonly CapDbContext _context;
        private readonly ILogger<SubmissionsController> _logger;

        public SubmissionsController(CapDbContext context, ILogger<SubmissionsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Submits an assessment with all answers
        /// </summary>
        /// <param name="submissionDto">Assessment submission data</param>
        /// <returns>Result of the submission operation</returns>
[HttpPost]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<ActionResult<SubmissionResponse>> SubmitAssessment(
    [FromBody] AssessmentSubmissionDto submissionDto)
{
    _logger.LogInformation("Received assessment submission for assessment {AssessmentId} from user {UserId}", 
        submissionDto?.assessment_id, submissionDto?.user_id);

    using var transaction = await _context.Database.BeginTransactionAsync();
    
    try
    {
        // Validate the request
        var validationResult = ValidateSubmission(submissionDto);
        if (validationResult != null)
        {
            return validationResult;
        }

        var userId = submissionDto.user_id;
        var assessmentId = submissionDto.assessment_id;

        // Verify user exists
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            _logger.LogWarning("User with ID {UserId} not found", userId);
            return BadRequest(new { error = "User does not exist" });
        }

        // Verify assessment exists
        var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == assessmentId);
        if (!assessmentExists)
        {
            _logger.LogWarning("Assessment with ID {AssessmentId} not found", assessmentId);
            return BadRequest(new { error = "Assessment does not exist" });
        }

        var submissions = new List<Submission>();
        var questionIds = submissionDto.Answers.Select(a => a.question_id).ToList();

        // Get all questions with their MCQ data in a single query
        var questionsWithMcqData = await _context.Questions
            .Where(q => questionIds.Contains(q.Id))
            .Include(q => q.McqQuestion)
            .ToDictionaryAsync(q => q.Id);

        // Get all associated AssessmentQuestions in one query
        var assessmentQuestions = await _context.AssessmentQuestions
            .Where(aq => aq.AssessmentId == assessmentId && questionIds.Contains(aq.QuestionId))
            .ToDictionaryAsync(aq => aq.QuestionId);

        foreach (var answer in submissionDto.Answers)
        {
            if (!questionsWithMcqData.TryGetValue(answer.question_id, out var question))
            {
                _logger.LogWarning("Question with ID {QuestionId} not found", answer.question_id);
                return BadRequest(new { error = $"Question with ID {answer.question_id} does not exist" });
            }

            if (!assessmentQuestions.TryGetValue(answer.question_id, out var assessmentQuestion))
            {
                _logger.LogWarning("Question {QuestionId} is not associated with Assessment {AssessmentId}", 
                    answer.question_id, assessmentId);
                return BadRequest(new { error = $"Question {answer.question_id} is not part of the assessment." });
            }

            var submission = new Submission
            {
                AssessmentId = assessmentId,
                QuestionId = answer.question_id,
                UserId = userId,
                Answer = answer.contributor_answer,
                StartedAt = submissionDto.started_time,
                SubmittedAt = submissionDto.submitted_time,
                Mark = 0 // Default to 0
            };

            // Get the total marks for this question in the assessment
            var questionMarks = assessmentQuestion.Mark > 0 ? assessmentQuestion.Mark : 1;

            // Handle MCQ marking
            if (answer.question_type?.ToLower() == "mc" && question.McqQuestion != null)
            {
                var isCorrect = question.McqQuestion.CorrectAnswer != null &&
                               question.McqQuestion.CorrectAnswer.Any(ca => 
                                   string.Equals(ca, answer.contributor_answer, StringComparison.OrdinalIgnoreCase));

                if (isCorrect)
                {
                    submission.Mark = questionMarks;
                }
            }
            // Handle Coding question marking
            else if (answer.question_type?.ToLower() == "coding")
            {
                // Validate test case data
                if (answer.test_pass.HasValue && answer.total_test_case.HasValue && answer.total_test_case > 0)
                {
                    // Calculate mark based on test pass ratio
                    double passRatio = (double)answer.test_pass.Value / answer.total_test_case.Value;
                    submission.Mark = (int)Math.Round(passRatio * questionMarks);
                    
                    _logger.LogInformation("Coding question {QuestionId} scored {Mark}/{Total} based on {Passed}/{TotalTests} test cases",
                        answer.question_id, submission.Mark, questionMarks, answer.test_pass, answer.total_test_case);
                }
                else
                {
                    _logger.LogWarning("Invalid test case data for coding question {QuestionId}", answer.question_id);
                    submission.Mark = 0; // No test cases passed or invalid data
                }
            }
            // For other question types (like essay), leave mark as 0 for manual grading

            submissions.Add(submission);
        }

        await _context.Submissions.AddRangeAsync(submissions);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        _logger.LogInformation("Successfully saved {Count} submissions for assessment {AssessmentId} by user {UserId}", 
            submissions.Count, assessmentId, userId);

        return Ok(new SubmissionResponse
        {
            Success = true,
            Message = "Assessment submitted successfully",
            SubmissionCount = submissions.Count,
            AssessmentId = assessmentId,
            UserId = userId,
            SubmittedAt = DateTime.UtcNow
        });
    }
    catch (DbUpdateException ex)
    {
        await transaction.RollbackAsync();
        _logger.LogError(ex, "Database error while saving assessment submission");
        return StatusCode(500, new { error = "Failed to save submission due to database error" });
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        _logger.LogError(ex, "Unexpected error while processing assessment submission");
        return StatusCode(500, new { error = "An unexpected error occurred while processing your submission" });
    }
}

        private ActionResult? ValidateSubmission(AssessmentSubmissionDto submissionDto)
        {
            if (submissionDto == null)
            {
                _logger.LogWarning("Empty submission request received");
                return BadRequest(new { error = "Submission data is required" });
            }
            
            if (submissionDto.user_id <= 0)
            {
                _logger.LogWarning("Invalid user ID in submission");
                return BadRequest(new { error = "Valid user ID is required" });
            }
            
            if (submissionDto.Answers == null || !submissionDto.Answers.Any())
            {
                _logger.LogWarning("Submission with no answers received");
                return BadRequest(new { error = "At least one answer is required" });
            }
            
            if (submissionDto.submitted_time < submissionDto.started_time)
            {
                _logger.LogWarning("Invalid time range in submission - submitted before started");
                return BadRequest(new { error = "Submitted time cannot be before started time" });
            }

            foreach (var answer in submissionDto.Answers)
            {
                if (string.IsNullOrWhiteSpace(answer.contributor_answer))
                {
                    _logger.LogWarning("Empty answer received for question {QuestionId}", answer.question_id);
                    return BadRequest(new { error = $"Answer for question {answer.question_id} cannot be empty" });
                }
            }

            return null;
        }
    }

    public class SubmissionResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int SubmissionCount { get; set; }
        public int AssessmentId { get; set; }
        public int UserId { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}
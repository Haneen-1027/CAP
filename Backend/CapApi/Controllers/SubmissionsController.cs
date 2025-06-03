using CapApi.Data;
using CapApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Models;
using CapApi.Dtos.Submission;
using Microsoft.Extensions.Logging;
using System.Text.RegularExpressions;

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

        [HttpGet("assessment/{assessmentId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<AssessmentSubmissionResponseDto>>> GetSubmissionsByAssessment(int assessmentId)
        {
            try
            {
                // Validate assessment exists
                var assessmentExists = await _context.Assessments.AnyAsync(a => a.Id == assessmentId);
                if (!assessmentExists)
                {
                    _logger.LogWarning("Assessment with ID {AssessmentId} not found", assessmentId);
                    return NotFound(new { error = $"Assessment with ID {assessmentId} does not exist" });
                }

                // Get all submissions for this assessment with related data
                var submissions = await _context.Submissions
                    .Where(s => s.AssessmentId == assessmentId)
                    .Include(s => s.User)
                    .Include(s => s.Question)
                        .ThenInclude(q => q.McqQuestion)
                    .Include(s => s.Question)
                        .ThenInclude(q => q.CodingQuestion)
                    .ToListAsync();

                if (!submissions.Any())
                {
                    return Ok(new List<AssessmentSubmissionResponseDto>());
                }

                // Get all assessment questions to get the total marks for each question
                var assessmentQuestions = await _context.AssessmentQuestions
                    .Where(aq => aq.AssessmentId == assessmentId)
                    .ToDictionaryAsync(aq => aq.QuestionId);

                // Group submissions by user
                var groupedSubmissions = submissions
                    .GroupBy(s => s.UserId)
                    .Select(g => new AssessmentSubmissionResponseDto
                    {
                        user_id = g.Key,
                        username = g.First().User?.Username ?? "unknown",
                        firstName = g.First().User?.FirstName ?? "Unknown",
                        lastName = g.First().User?.LastName ?? "User",
                        assessment_id = assessmentId,
                        Answers = g.Select(s =>
                        {
                            var question = s.Question;
                            var assessmentQuestion = assessmentQuestions.GetValueOrDefault(s.QuestionId);
                            var totalMark = assessmentQuestion?.Mark ?? 0;

                            // Build question details based on type
                            object questionDetails = null;
                            if (question?.Type?.ToLower() == "mc" && question.McqQuestion != null)
                            {
                                var visibleOptions = new List<string>();
                                if (question.McqQuestion.CorrectAnswer != null)
                                {
                                    visibleOptions.AddRange(question.McqQuestion.CorrectAnswer);
                                }
                                if (question.McqQuestion.WrongOptions != null)
                                {
                                    visibleOptions.AddRange(question.McqQuestion.WrongOptions);
                                }

                                questionDetails = new
                                {
                                    question_type = "mc",
                                    visible_options = visibleOptions
                                };
                            }
                            else if (question?.Type?.ToLower() == "coding" && question.CodingQuestion != null)
                            {
                                // Detect language from answer content
                                int detectedLanguageId = DetectProgrammingLanguage(s.Answer);

                                questionDetails = new
                                {
                                    question_type = "coding",
                                    used_langauage = detectedLanguageId,
                                    test_cases = new
                                    {
                                        tests_parameters = new List<string>(),
                                        excpected_output = new List<string>(),
                                        tests_count = question.CodingQuestion.TestCases?.Count ?? 0,
                                        test_passed = 0 // This would need to come from submission data
                                    }
                                };
                            }
                            else if (question?.Type?.ToLower() == "essay")
                            {
                                questionDetails = new
                                {
                                    question_type = "essay"
                                };
                            }

                            return new AnswerDto
                            {
                                question_id = s.QuestionId,
                                prompt = question?.Prompt ?? "Unknown question",
                                contributor_answer = s.Answer ?? string.Empty,
                                question_details = questionDetails,
                                new_mark = (int)(s.Mark ?? -99), // -99 indicates not graded
                                total_mark = totalMark
                            };
                        }).ToList(),
                        started_time = g.Min(s => s.StartedAt),
                        submitted_time = g.Max(s => s.SubmittedAt)
                    })
                    .ToList();

                _logger.LogInformation("Retrieved {Count} user submissions for assessment {AssessmentId}", groupedSubmissions.Count, assessmentId);

                return Ok(groupedSubmissions);
            }
            catch (Exception ex)
            {
                _logger.LogError(0, ex, "Error retrieving submissions for assessment {AssessmentId}", assessmentId);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { error = "An error occurred while retrieving submissions" });
            }
        }

        // Helper method to detect programming language from code
        private int DetectProgrammingLanguage(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                return 71; // Default to Python if empty
            }

            // Trim whitespace and normalize line endings
            var normalizedCode = Regex.Replace(code.Trim(), @"\r\n|\n\r|\n|\r", "\n");

            // Check for JavaScript patterns
            var jsPatterns = new[]
            {
                @"\bfunction\b",   // function keyword
                @"=>",             // arrow function
                @"\bconsole\.",    // console.log
                @"\bconst\b",      // const declaration
                @"\blet\b",        // let declaration
                @"\bvar\b",        // var declaration
                @"/\*.*\*/",       // multi-line comment
                @"//.*"            // single-line comment
            };

            // Check for Python patterns
            var pythonPatterns = new[]
            {
                @"\bdef\b",        // def keyword
                @"\bclass\b",      // class keyword
                @"\blambda\b",    // lambda keyword
                @"\bimport\b",    // import statement
                @"\bfrom\b",       // from statement
                @"#.*",            // Python comment
                @"\bprint\s*\(",   // print function
                @"\bwith\b"        // with statement
            };

            var jsMatches = jsPatterns.Count(pattern => Regex.IsMatch(normalizedCode, pattern));
            var pythonMatches = pythonPatterns.Count(pattern => Regex.IsMatch(normalizedCode, pattern));

            // More matches for JavaScript patterns
            if (jsMatches > pythonMatches)
            {
                return 63; // JavaScript
            }
            // More matches for Python patterns or equal matches
            return 71; // Python
        }

        [HttpGet("check-submission")]
        public async Task<IActionResult> CheckExistingSubmission(
            [FromQuery] int userId, 
            [FromQuery] int assessmentId)
        {
            try
            {
                var existingSubmission = await _context.Submissions
                    .AnyAsync(s => 
                        s.UserId == userId && 
                        s.AssessmentId == assessmentId &&
                        s.SubmittedAt != null);

                return Ok(new { submitted = existingSubmission });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking existing submission");
                return StatusCode(500, new { error = "Error checking submission status" });
            }
        }
        /// <summary>
        /// Submits an assessment with all answers
        /// </summary>
        /// <param name="submissionDto">Assessment submission data</param>
        /// <returns>Result of the submission operation</returns>
[HttpPost]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status409Conflict)]
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
        if (validationResult != null) return validationResult;

        var userId = submissionDto.user_id;
        var assessmentId = submissionDto.assessment_id;

        // Check for existing submission first
        var existingSubmission = await _context.Submissions
            .AnyAsync(s => 
                s.UserId == userId && 
                s.AssessmentId == assessmentId &&
                s.SubmittedAt != null);

        if (existingSubmission)
        {
            _logger.LogWarning("User {UserId} already submitted assessment {AssessmentId}", userId, assessmentId);
            return Conflict(new { 
                success = false,
                message = "You have already submitted this assessment"
            });
        }

        // Initialize submissions list
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
        [HttpPut("update-mark")]
        public async Task<IActionResult> UpdateMark([FromBody] UpdateMarkDto updateMarkDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the submission
            var submission = await _context.Submissions
                .FirstOrDefaultAsync(s => 
                    s.UserId == updateMarkDto.UserId &&
                    s.AssessmentId == updateMarkDto.AssessmentId &&
                    s.QuestionId == updateMarkDto.QuestionId);

            if (submission == null)
            {
                return NotFound("Submission not found");
            }

            // Update the mark
            submission.Mark = updateMarkDto.Mark;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { 
                    success = true, 
                    message = "Mark updated successfully",
                    updatedMark = submission.Mark
                });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"An error occurred while updating the mark: {ex.Message}");
            }
        }
        
    }


    public class AssessmentSubmissionResponseDto
    {
        public int user_id { get; set; }
        public string username { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public int assessment_id { get; set; }
        public List<AnswerDto> Answers { get; set; }
        public DateTime started_time { get; set; }
        public DateTime submitted_time { get; set; }
    }

    //public class Answer1Dto
    //{
    //    public int question_id { get; set; }
    //    public string prompt { get; set; }
    //    public string contributor_answer { get; set; }
    //    public object question_details { get; set; }
    //    public int new_mark { get; set; }
    //    public int total_mark { get; set; }
    //}

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
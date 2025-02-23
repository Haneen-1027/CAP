using Microsoft.AspNetCore.Mvc;
using webApi.Data;
using webApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace webApi.Controllers
{
    [ApiController]
    [Route("api/questions")]
    public class QuestionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public IActionResult AddQuestion([FromBody] AddQuestionRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Type) || string.IsNullOrEmpty(request.Prompt) ||
                 string.IsNullOrEmpty(request.Category) || request.Details == null)
            {
                return BadRequest(new { Message = "Invalid request. All fields are required." });
            }

            var question = new Question
            {
                Type = request.Type,
                //Mark = request.Mark,
                Prompt = request.Prompt,
                Category = request.Category,
                CreatedAt = DateTime.UtcNow
            };

            // Handle different question types
            switch (request.Type.ToLower())
            {
                case "mc":
                    if (!request.Details.ContainsKey("correctAnswer") || !request.Details.ContainsKey("wrongOptions"))
                    {
                        return BadRequest(new { Message = "MCQ must have a correct answer and wrong options." });
                    }

                    question.MCQQuestion = new MCQQuestion
                    {
                        IsTrueFalse = request.Details.ContainsKey("isTrueFalse") && (bool)request.Details["isTrueFalse"],
                        CorrectAnswer = request.Details["correctAnswer"].ToString(),
                        WrongOptions = ((JsonElement)request.Details["wrongOptions"]).EnumerateArray().Select(x => x.GetString()).ToList()
                    };
                    break;

                case "essay":
                    question.EssayQuestion = new EssayQuestion();
                    break;

                case "coding":
                    if (!request.Details.ContainsKey("testCases") || !request.Details.ContainsKey("inputsCount"))
                    {
                        return BadRequest(new { Message = "Coding questions must have test cases and inputsCount." });
                    }

                    question.CodingQuestion = new CodingQuestion
                    {
                        InputsCount = int.Parse(request.Details["inputsCount"].ToString()),
                        TestCases = ((JsonElement)request.Details["testCases"]).EnumerateArray()
                            .Select(tc => new TestCase
                            {
                                Inputs = tc.GetProperty("inputs").EnumerateArray().Select(x => x.GetString()).ToList(),
                                ExpectedOutput = tc.GetProperty("expectedOutput").GetString()
                            }).ToList()
                    };
                    break;

                default:
                    return BadRequest(new { Message = "Invalid question type." });
            }

            _context.Questions.Add(question);
            _context.SaveChanges();

            return Ok(new { Message = "Question Added", Id = question.Id });
        }

        [HttpDelete("delete")]
        public IActionResult DeleteQuestion([FromBody] DeleteQuestionRequest request)
        {
            if (request == null || request.QuestionId <= 0)
            {
                return BadRequest(new { Message = "Invalid question ID." });
            }

            var question = _context.Questions.Find(request.QuestionId);
            if (question == null)
            {
                return NotFound(new { Message = "Question not found." });
            }

            _context.Questions.Remove(question);
            _context.SaveChanges();

            return Ok(new { Message = "Question deleted successfully." });
        }

        [HttpPost("preview-by-category")]
        public IActionResult PreviewQuestionsByCategory([FromBody] CategoryRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { Message = "Request body is required." });
            }

            IQueryable<Question> query = _context.Questions;

            // Apply category filter if provided
            if (!string.IsNullOrEmpty(request.Category))
            {
                query = query.Where(q => q.Category == request.Category);
            }

            // Apply type filter if provided
            if (!string.IsNullOrEmpty(request.Type))
            {
                query = query.Where(q => q.Type == request.Type);
            }

            // Count total questions in category (ignores type filter)
            int totalCategoryQuestions = string.IsNullOrEmpty(request.Category)
                ? _context.Questions.Count()
                : _context.Questions.Count(q => q.Category == request.Category);

            // Count total questions in type (ignores category filter)
            int totalTypeQuestions = string.IsNullOrEmpty(request.Type)
                ? _context.Questions.Count()
                : _context.Questions.Count(q => q.Type == request.Type);

            // Apply pagination
            var questions = query
                .OrderBy(q => q.Id)  // Ensure consistent ordering
                .Skip((request.PageNumber - 1) * request.NumberOfQuestions)
                .Take(request.NumberOfQuestions)
                .Select(q => new
                {
                    type = q.Type,
                    //mark = q.Mark,
                    prompt = q.Prompt,
                    category = q.Category,
                    details = GetDetailsBasedOnType(q)
                })
                .ToList();

            return Ok(new
            {
                totalCategoryQuestions,
                totalTypeQuestions,
                questions,
                returnMessage = "Done!"
            });
        }


        private static object GetDetailsBasedOnType(Question q)
        {
            return q.Type.ToLower() switch
            {
                "mc" => q.MCQQuestion != null ? new
                {
                    isTrueFalse = q.MCQQuestion.IsTrueFalse,
                    correctAnswer = q.MCQQuestion.CorrectAnswer,
                    wrongOptions = q.MCQQuestion.WrongOptions
                } : new { Message = "MCQ data missing" },

                "essay" => q.EssayQuestion != null ? new { } : new { Message = "Essay data missing" },

                "coding" => q.CodingQuestion != null ? new
                {
                    testCases = q.CodingQuestion.TestCases?.Select(tc => new
                    {
                        inputs = tc.Inputs,
                        expectedOutput = tc.ExpectedOutput
                    }).ToList()
                } : new { Message = "Coding data missing" },

                _ => new { Message = "Invalid question type." }
            };
        }

        [HttpPost("preview-by-id")]
        public IActionResult PreviewQuestionById([FromBody] QuestionIdRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.QuestionId))
            {
                return BadRequest(new { Message = "Question ID is required." });
            }

            // Convert QuestionId to an integer
            if (!int.TryParse(request.QuestionId, out int questionId))
            {
                return BadRequest(new { Message = "Invalid Question ID format." });
            }

            var question = _context.Questions
                .Where(q => q.Id == questionId)
                .Select(q => new
                {
                    id = q.Id,
                    general = new
                    {
                        type = q.Type,
                        //mark = q.Mark,
                        prompt = q.Prompt,
                        category = q.Category,
                        details = GetDetailsBasedOnType(q)
                    }
                })
                .FirstOrDefault();

            if (question == null)
            {
                return NotFound(new { Message = "Question not found." });
            }

            return Ok(question);
        }

        //**//
        // Add the update endpoint in the QuestionsController

        [HttpPut("update")]
        public IActionResult UpdateQuestion([FromBody] UpdateQuestionRequest request)
        {
            if (request == null || request.QuestionId <= 0 ||
                string.IsNullOrEmpty(request.Type) || string.IsNullOrEmpty(request.Prompt) ||
                 string.IsNullOrEmpty(request.Category) || request.Details == null)
            {
                return BadRequest(new { Message = "Invalid request. All fields are required." });
            }

            var question = _context.Questions.Include(q => q.MCQQuestion)
                                             .Include(q => q.EssayQuestion)
                                             .Include(q => q.CodingQuestion)
                                             .FirstOrDefault(q => q.Id == request.QuestionId);

            if (question == null)
            {
                return NotFound(new { Message = "Question not found." });
            }

            // Update question's general properties
            question.Type = request.Type;
            //question.Mark = request.Mark;
            question.Prompt = request.Prompt;
            question.Category = request.Category;

            // Handle different question types
            switch (request.Type.ToLower())
            {
                case "mc":
                    if (!request.Details.ContainsKey("correctAnswer") || !request.Details.ContainsKey("wrongOptions"))
                    {
                        return BadRequest(new { Message = "MCQ must have a correct answer and wrong options." });
                    }

                    if (question.MCQQuestion == null)
                    {
                        question.MCQQuestion = new MCQQuestion();
                    }

                    question.MCQQuestion.IsTrueFalse = request.Details.ContainsKey("isTrueFalse") && ((JsonElement)request.Details["isTrueFalse"]).GetBoolean();
                    question.MCQQuestion.CorrectAnswer = request.Details["correctAnswer"].ToString();
                    question.MCQQuestion.WrongOptions = ((JsonElement)request.Details["wrongOptions"]).EnumerateArray().Select(x => x.GetString()).ToList();
                    break;

                case "essay":
                    if (question.EssayQuestion == null)
                    {
                        question.EssayQuestion = new EssayQuestion();
                    }
                    break;

                case "coding":
                    if (!request.Details.ContainsKey("testCases") || !request.Details.ContainsKey("inputsCount"))
                    {
                        return BadRequest(new { Message = "Coding questions must have test cases and inputsCount." });
                    }

                    if (question.CodingQuestion == null)
                    {
                        question.CodingQuestion = new CodingQuestion();
                    }

                    question.CodingQuestion.InputsCount = int.Parse(request.Details["inputsCount"].ToString());
                    question.CodingQuestion.TestCases = ((JsonElement)request.Details["testCases"]).EnumerateArray()
                        .Select(tc => new TestCase
                        {
                            Inputs = tc.GetProperty("inputs").EnumerateArray().Select(x => x.GetString()).ToList(),
                            ExpectedOutput = tc.GetProperty("expectedOutput").GetString()
                        }).ToList();
                    break;

                default:
                    return BadRequest(new { Message = "Invalid question type." });
            }

            _context.Questions.Update(question);
            _context.SaveChanges();

            return Ok(new { Message = "Question Updated", Id = question.Id });
        }


    }

    public class AddQuestionRequest
    {
        public string Type { get; set; }
        //public float Mark { get; set; }
        public string Prompt { get; set; }
        public string Category { get; set; }
        public Dictionary<string, object> Details { get; set; } // Handles MCQ, Coding, and Essay details dynamically
    }


    public class QuestionDetails
    {
        public bool? IsTrueFalse { get; set; }
        public string? CorrectAnswer { get; set; }  // Nullable for essay and coding
        public List<string>? WrongOptions { get; set; }  // Nullable for essay and coding
        public List<TestCaseRequest>? TestCases { get; set; }  // Required only for coding
    }


    public class TestCaseRequest
    {
        public List<string> Inputs { get; set; }
        public string ExpectedOutput { get; set; }
    }

    public class DeleteQuestionRequest
    {
        public int QuestionId { get; set; }
    }

    public class CategoryRequest
    {
        public string Category { get; set; }
        public string Type { get; set; }  // Optional: If specified, filter by this type.
        public int NumberOfQuestions { get; set; } = 10;  // Default to 10 per page
        public int PageNumber { get; set; } = 1;  // Default to page 1
    }



    // Request model for PreviewQuestionById
    public class QuestionIdRequest
    {
        public string QuestionId { get; set; }
    }

    public class UpdateQuestionRequest : AddQuestionRequest
    {
        public int QuestionId { get; set; }
    }
}

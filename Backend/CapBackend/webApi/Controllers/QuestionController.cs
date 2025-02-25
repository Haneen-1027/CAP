using Microsoft.AspNetCore.Mvc;
using webApi.Data;
using webApi.Models;
using webApi.DTOs;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace webApi.Controllers
{
    [ApiController]
    [Route("api/questions")]
    [EnableCors("AllowOrigin")]
    public class QuestionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
        
        public IActionResult AddQuestion([FromBody] AddQuestionRequest request)
        {
            if (string.IsNullOrEmpty(request.Type) || string.IsNullOrEmpty(request.Prompt) ||
                 string.IsNullOrEmpty(request.Category)) //|| request.Details == null || request == null)
            {
                return BadRequest(new { Message = "Invalid request. All fields are required." });
            }

            var question = new Question
            {
                Type = request.Type,
                //Mark = request.Mark,
                Prompt = request.Prompt,
                Category = request.Category,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Handle different question types
            switch (request.Type.ToLower())
            {
                case "mc":
                    if (request.Details == null || !request.Details.ContainsKey("correctAnswer") || !request.Details.ContainsKey("wrongOptions"))
                    {
                        return BadRequest(new { Message = "MCQ must have a correct answer and wrong options." });
                    }

                    question.MCQQuestion = new MCQQuestion
                    {
                        IsTrueFalse = request.Details.ContainsKey("isTrueFalse") && (bool)request.Details["isTrueFalse"],
                        CorrectAnswer = request.Details["correctAnswer"].ToString(),
                        WrongOptions = ((JsonElement)request.Details["wrongOptions"]).EnumerateArray().Select(x => x.GetString() ?? string.Empty).ToList() 
                    };
                    break;

                case "essay":
                    question.EssayQuestion = new EssayQuestion();
                    break;

                case "coding":
                    if (request.Details == null || !request.Details.ContainsKey("testCases") || !request.Details.ContainsKey("inputsCount") || !request.Details.ContainsKey("description"))
                    {
                        return BadRequest(new { Message = "Coding questions must have test cases, inputsCount, and description." });
                    }

                    var codingQuestion = new CodingQuestion
                    {
                        
                        InputsCount = int.Parse(request.Details["inputsCount"].ToString()),
                        Description = request.Details["description"]?.ToString() ?? string.Empty,
                        TestCases = ((JsonElement)request.Details["testCases"]).EnumerateArray()
                            .Select(tc => new TestCase
                            {
                                Inputs = tc.GetProperty("inputs").EnumerateArray().Select(x => x.GetString() ?? string.Empty
                                ).ToList(),
                                ExpectedOutput = tc.GetProperty("expectedOutput").GetString() ?? string.Empty
                            }).ToList()
                    };

                    question.CodingQuestion = codingQuestion;
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
            if (request.QuestionId <= 0)
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
                    description = q.CodingQuestion.Description, // Add this line
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
            if (string.IsNullOrEmpty(request.QuestionId))
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
            if (request.QuestionId <= 0 ||
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
            question.UpdatedAt= DateTime.UtcNow;

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
                    if (!request.Details.ContainsKey("testCases") || !request.Details.ContainsKey("inputsCount") || !request.Details.ContainsKey("description"))
                    {
                        return BadRequest(new { Message = "Coding questions must have test cases, inputsCount, and description." });
                    }

                    if (question.CodingQuestion == null)
                    {
                        question.CodingQuestion = new CodingQuestion();
                    }

                    question.CodingQuestion.InputsCount = int.Parse(request.Details["inputsCount"].ToString());
                    question.CodingQuestion.Description = request.Details["description"].ToString(); // Add this line
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
}

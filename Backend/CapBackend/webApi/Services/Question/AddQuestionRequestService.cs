using Microsoft.AspNetCore.Mvc;
using webApi.Data;
using webApi.Models;
using webApi.DTOs;
using System.Text.Json;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;
using webApi.Services.Question;

namespace webApi.Services.Question
{
    public class AddQuestionRequestService : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AddQuestionRequestService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Handle(AddQuestionRequest request)
        {
                        if (string.IsNullOrEmpty(request.Type) || string.IsNullOrEmpty(request.Prompt) ||
                 string.IsNullOrEmpty(request.Category)) //|| request.Details == null || request == null)
            {
                return BadRequest(new { Message = "Invalid request. All fields are required." });
            }

            var question = new Models.Question
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
    }
}
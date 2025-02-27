using Microsoft.AspNetCore.Mvc;
using webApi.Data;
using webApi.Models;
using webApi.DTOs;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace webApi.Services.Question
{
    public class UpdateQuestionService : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UpdateQuestionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Handle(UpdateQuestionRequest request)
        {
                        if (string.IsNullOrEmpty(request.Type) || string.IsNullOrEmpty(request.Prompt) ||
                 string.IsNullOrEmpty(request.Category)) //|| request.Details == null || request == null)
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
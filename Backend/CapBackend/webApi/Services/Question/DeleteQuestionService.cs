using Microsoft.AspNetCore.Mvc;
using webApi.Data;
using webApi.Models;
using webApi.DTOs;

namespace webApi.Services.Question
{
    public class DeleteQuestionService : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DeleteQuestionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Handle(DeleteQuestionRequest request)
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
        }
    }

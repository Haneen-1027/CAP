using CapApi.Data;
using Microsoft.AspNetCore.Mvc;

namespace CapApi.Services.Question
{
    public class DeleteQuestionService(ApplicationDbContext context) : ControllerBase
    {
        public Task<IActionResult> Handle(int id)
        {
            if (id <= 0)
            {
                return Task.FromResult<IActionResult>(BadRequest(new { Message = "Invalid question ID." }));
            }

            var question = context.Questions.Find(id);
            if (question == null)
            {
                return Task.FromResult<IActionResult>(NotFound(new { Message = "Question not found." }));
            }

            context.Questions.Remove(question);
            context.SaveChanges();

            return Task.FromResult<IActionResult>(Ok(new { Message = "Question deleted successfully." }));
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using CapApi.DTOs;
using CapApi.Services.Question;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace CapApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors("AllowOrigin")]
    public class QuestionsController(
        AddQuestionRequestService addQuestionRequestService,
        DeleteQuestionService deleteQuestionService,
        PreviewByCategoryService previewByCategoryService,
        PreviewByIdService previewByIdService,
        UpdateQuestionService updateQuestionService)
        : ControllerBase
    {
        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
        public async Task<IActionResult> AddQuestionRequest(AddQuestionRequest request)
        {
            return await addQuestionRequestService.Handle(request);
        }
        
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionRequest(int id)
        { 
            return await deleteQuestionService.Handle(id);
        }

        
        //[Authorize(Roles = "Admin")]
        [HttpPost("preview-by-category")]
        public async Task<IActionResult> PreviewByCategory(CategoryRequest request)
        {
            return await previewByCategoryService.Handle(request);
        }
        
        //[Authorize(Roles = "Admin")]
        [HttpPost("preview-by-id")]
        public async Task<IActionResult> PreviewById(QuestionIdRequest request)
        {
            return await previewByIdService.Handle(request);
        }
        
        //[Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, UpdateQuestionRequest updatedQuestion)
        {
            return await updateQuestionService.Handle(id, updatedQuestion);
        }
        
     }
}

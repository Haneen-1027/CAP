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
        QuestionByCategoryService questionByCategoryService,
        QuestionByIdService questionByIdService,
        UpdateQuestionService updateQuestionService)
        : ControllerBase
    {
        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
        public async Task<IActionResult> AddQuestionRequest(AddQuestionDto dto)
        {
            return await addQuestionRequestService.Handle(dto);
        }
        
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionRequest(int id)
        { 
            return await deleteQuestionService.Handle(id);
        }

        
        //[Authorize(Roles = "Admin")]
        [HttpPost("preview-by-category")]
        public async Task<IActionResult> PreviewByCategory(QuestionByCategoryDto dto)
        {
            return await questionByCategoryService.Handle(dto);
        }
        
        //[Authorize(Roles = "Admin")]
        [HttpPost("preview-by-id")]
        public async Task<IActionResult> PreviewById(QuestionByIdDto? dto)
        {
            return await questionByIdService.Handle(dto);
        }
        
        //[Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, UpdateQuestionDto? updatedQuestion)
        {
            return await updateQuestionService.Handle(id, updatedQuestion);
        }
        
     }
}

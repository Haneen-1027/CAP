using Microsoft.AspNetCore.Mvc;
using webApi.Data;
using webApi.Models;
using webApi.DTOs;
using System.Text.Json;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;
using webApi.Services.Question;

namespace webApi.Controllers
{
    [ApiController]
    [Route("api/questions")]
    [EnableCors("AllowOrigin")]
    public class QuestionsController : ControllerBase
    {
         private readonly AddQuestionRequestService _addQuestionRequestService;
         private readonly DeleteQuestionService _deleteQuestionService;
         private readonly PreviewByCategoryService _previewByCategoryService;
         private readonly PreviewByIdService _previewByIdService;
         private readonly UpdateQuestionService _updateQuestionService;

        public QuestionsController(
             AddQuestionRequestService addQuestionRequestService, 
             DeleteQuestionService deleteQuestionService,
             PreviewByCategoryService previewByCategoryService,
             PreviewByIdService previewByIdService,
             UpdateQuestionService updateQuestionService
            )
        {
             _addQuestionRequestService = addQuestionRequestService;
             _deleteQuestionService = deleteQuestionService;
             _previewByCategoryService = previewByCategoryService;
             _previewByIdService = previewByIdService;
             _updateQuestionService = updateQuestionService;
        }
        
        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
        public async Task<IActionResult> AddQuestionRequest(AddQuestionRequest request)
        {
            return await _addQuestionRequestService.Handle(request);
        }
        
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteQuestionRequest(DeleteQuestionRequest request)
        {
            return await _deleteQuestionService.Handle(request);
        }

        
        //[Authorize(Roles = "Admin")]
        [HttpPost("preview-by-category")]
        public async Task<IActionResult> PreviewByCategory(CategoryRequest request)
        {
            return await _previewByCategoryService.Handle(request);
        }
        
        //[Authorize(Roles = "Admin")]
        [HttpPost("preview-by-id")]
        public async Task<IActionResult> PreviewByID(QuestionIdRequest request)
        {
            return await _previewByIdService.Handle(request);
        }
        
        //[Authorize(Roles = "Admin")]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateQuestion(UpdateQuestionRequest request)
        {
            return await _updateQuestionService.Handle(request);
        }
        
     }
}

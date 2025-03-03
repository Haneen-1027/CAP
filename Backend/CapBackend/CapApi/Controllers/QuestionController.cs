using Microsoft.AspNetCore.Mvc;
using CapApi.DTOs;
using CapApi.Services.Question;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace CapApi.Controllers
{
    [ApiController]
    [Route("questions")]
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
        [HttpPost]
        public async Task<IActionResult> AddQuestionRequest([FromBody] AddQuestionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                return await addQuestionRequestService.Handle(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while adding the question.", Error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionRequest(int id)
        {
            try
            {
                return await deleteQuestionService.Handle(id);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while deleting the question.", Error = ex.Message });
            }
        }

        [HttpPost("preview-by-category")]
        public async Task<IActionResult> PreviewByCategory([FromBody] QuestionByCategoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                return await questionByCategoryService.Handle(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while previewing questions by category.", Error = ex.Message });
            }
        }

        [HttpPost("preview-by-id")]
        public async Task<IActionResult> PreviewById([FromBody] QuestionByIdDto? dto)
        {
            if (dto == null || !ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                return await questionByIdService.Handle(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while previewing the question by ID.", Error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] UpdateQuestionDto? updatedQuestion)
        {
            if (updatedQuestion == null || !ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                return await updateQuestionService.Handle(id, updatedQuestion);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { Message = "An error occurred while updating the question.", Error = ex.Message });
            }
        }
    }
}
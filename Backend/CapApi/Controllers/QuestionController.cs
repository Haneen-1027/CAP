using CapApi.Data;
using Microsoft.AspNetCore.Mvc;
using CapApi.DTOs;
using CapApi.Dtos.Question;
using CapApi.Services.Question;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace CapApi.Controllers;

[ApiController]
//[Authorize(Roles = "Admin")]
[Route("questions")]
[EnableCors("AllowOrigin")]
public class QuestionsController(
    AddQuestionRequestService addQuestionRequestService,
    DeleteQuestionService deleteQuestionService,
    QuestionByCategoryService questionByCategoryService,
    QuestionByIdService questionByIdService,
    UpdateQuestionService updateQuestionService,
    CapDbContext context)
    : ControllerBase
{
    private readonly CapDbContext _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAllQuestions()
    {
        var questions = await _context.Questions
            .Include(q => q.McqQuestion)
            .Include(q => q.CodingQuestion)
            .ThenInclude(cq => cq.TestCases)
            .Include(q => q.EssayQuestion)
            .ToListAsync();

        var questionDtos = questions.Select(QuestionDto.FromModel).ToList();

        return Ok(questionDtos);
    }


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

    //[Authorize(Roles = "Admin")]
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

    [HttpGet("filter")]
    public async Task<IActionResult> PreviewByCategory(
        [FromQuery] string? category,
        [FromQuery] string? type,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10)
    {
        if (page < 1 || limit < 1)
            return BadRequest(new { Message = "Page number and number of questions must be greater than 0." });

        try
        {
            var result = await questionByCategoryService.Handle(category, type, page, limit);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "An error occurred while previewing questions by category.",
                Error = ex.Message
            });
        }
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> PreviewById(int id)
    {
        if (id < 1)
            return BadRequest(new { Message = "Id must be greater than 0." });

        try
        {
            return await questionByIdService.Handle(id);
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
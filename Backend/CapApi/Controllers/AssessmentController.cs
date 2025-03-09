using CapApi.Dtos.Assessment;
using CapApi.DTOs.Assessment;
using CapApi.Services.Assessment;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace CapApi.Controllers;

[ApiController]
//[Authorize(Roles = "Admin")]
[Route("assessments")]
[EnableCors("AllowAll")]
public class AssessmentController(
    AddAssessmentService addAssessmentService,
    DeleteAssessmentService deleteAssessmentService,
    GetAssessmentByIdService getAssessmentByIdService,
    GetAllAssessmentService getAllAssessmentService,
    UpdateAssessmentService updateAssessmentService)
    : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> AddAssessment([FromBody] AddAssessmentDto? dto)
    {
        if (dto == null || !ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            return await addAssessmentService.Handle(dto);
        }
        catch (Exception ex)
        {
            return StatusCode(500,
                new { Message = "An error occurred while adding the assessment.", Error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAssessment(int id)
    {
        try
        {
            return await deleteAssessmentService.Handle(id);
        }
        catch (Exception ex)
        {
            return StatusCode(500,
                new { Message = "An error occurred while deleting the assessment.", Error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAssessments()
    {
        try
        {
            return await getAllAssessmentService.Handle();
        }
        catch (Exception ex)
        {
            return StatusCode(500,
                new { Message = "An error occurred while fetching all assessments.", Error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAssessmentById(int id)
    {
        try
        {
            return await getAssessmentByIdService.Handle(id);
        }
        catch (Exception ex)
        {
            return StatusCode(500,
                new { Message = "An error occurred while fetching the assessment by ID.", Error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAssessment(int id, [FromBody] UpdateAssessmentDto? dto)
    {
        if (dto == null || !ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            return await updateAssessmentService.Handle(id, dto);
        }
        catch (Exception ex)
        {
            return StatusCode(500,
                new { Message = "An error occurred while updating the assessment.", Error = ex.Message });
        }
    }
}
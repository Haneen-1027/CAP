using CapApi.DTOs;
using CapApi.Services.Assessment;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace CapApi.Controllers;

[ApiController]
[Route("[controller]")]
[EnableCors("AllowOrigin")]
public class AssessmentController(
    AddAssessmentService addAssessmentService,
    DeleteAssessmentService deleteAssessmentService,
    GetAssessmentByIdService getAssessmentByIdService,
    GetAllAssessmentService getAllAssessmentService,
    UpdateAssessmentService updateAssessmentService)
    : ControllerBase
{
    //[Authorize(Roles = "Admin")]
    [HttpPost("add")]
    public async Task<IActionResult> AddAssessment(AddAssessmentDto? dto)
    {
        return await addAssessmentService.Handle(dto);
    }

    //[Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAssessment(int id)
    {
        return await deleteAssessmentService.Handle(id);
    }


    //[Authorize(Roles = "Admin")]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllAssessments()
    {
        return await getAllAssessmentService.Handle();
    }

    //[Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAssessmentById(int id)
    {
        return await getAssessmentByIdService.Handle(id);
    }

    //[Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuestion(int id, [FromBody] UpdateAssessmentDto? dto)
    {
        return await updateAssessmentService.Handle(id, dto);
    }
}
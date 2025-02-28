using CapApi.DTOs;
using CapApi.Services.Assessment;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace CapApi.Controllers;

[ApiController]
[Route("[controller]")]
[EnableCors("AllowOrigin")]
public class AssessmentController : ControllerBase
{

    private readonly AddAssessmentService _addAssessmentService;
    private readonly DeleteAssessmentService _deleteAssessmentService;
    private readonly GetAssessmentByIdService _getAssessmentByIdService;
    private readonly GetAllAssessmentService _getAllAssessmentService;
    private readonly UpdateAssessmentService _updateAssessmentService;

    public AssessmentController(
        AddAssessmentService addAssessmentService,
        DeleteAssessmentService deleteAssessmentService,
        GetAssessmentByIdService getAssessmentByIdService,
        GetAllAssessmentService getAllAssessmentService,
        UpdateAssessmentService updateAssessmentService
    )
    {
        _addAssessmentService = addAssessmentService;
        _deleteAssessmentService = deleteAssessmentService;
        _getAssessmentByIdService = getAssessmentByIdService;
        _getAllAssessmentService = getAllAssessmentService;
        _updateAssessmentService = updateAssessmentService;
    }
    
    //[Authorize(Roles = "Admin")]
    [HttpPost("add")]
    public async Task<IActionResult> AddAssessment(CreateAssessmentDto? dto)
    {
        return await _addAssessmentService.Handle(dto);
    }

    //[Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAssessment(int id)
    {
        return await _deleteAssessmentService.Handle(id);
    }


    //[Authorize(Roles = "Admin")]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllAssessments()
    {
        return await _getAllAssessmentService.Handle();
    }

    //[Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAssessmentById(int id)
    {
        return await _getAssessmentByIdService.Handle(id);
    }

    //[Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuestion(int id, [FromBody] UpdateAssessmentDto? dto)
    {
        return await _updateAssessmentService.Handle(id, dto);
    }
}
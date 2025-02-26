﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webApi.Data;
using webApi.Services;
using webApi.Models;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace webApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodeController : ControllerBase
    {
        private readonly Judge0Service _judge0Service;
        private readonly ApplicationDbContext _context;

        public CodeController(Judge0Service judge0Service, ApplicationDbContext context)
        {
            _judge0Service = judge0Service;
            _context = context;
        }

        [HttpPost("execute/{questionId}")]
        public async Task<IActionResult> ExecuteCode(int questionId, [FromBody] CodeExecutionRequest request)
        {
            var codingQuestion = await _context.CodingQuestions
                .Include(q => q.TestCases)
                .FirstOrDefaultAsync(q => q.QuestionId == questionId);

            if (codingQuestion == null)
            {
                return NotFound(new { message = "Question not found" });
            }

            var testResults = new List<TestCaseResult>();

            foreach (var testCase in codingQuestion.TestCases)
            {
                var result = await _judge0Service.SubmitCodeAsync(request.SourceCode, request.LanguageId, string.Join("\n", testCase.Inputs));

                testResults.Add(new TestCaseResult
                {
                    Inputs = testCase.Inputs,
                    ExpectedOutput = testCase.ExpectedOutput,
                    ActualOutput = result
                });
            }

            return Ok(testResults);
        }
    }

    public class CodeExecutionRequest
    {
        public string SourceCode { get; set; }
        public int LanguageId { get; set; }
    }

    public class TestCaseResult
    {
        public List<string> Inputs { get; set; }
        public string ExpectedOutput { get; set; }
        public string ActualOutput { get; set; }
    }
}

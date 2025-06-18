using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Data;
using CapApi.Dtos.Code;
using CapApi.Services.Judge0;
using Microsoft.AspNetCore.Cors;
using System.Text.RegularExpressions;
using System.Linq;
using CapApi.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System;
using System.Diagnostics;

namespace CapApi.Controllers;

[ApiController]
[Route("[controller]")]
[EnableCors("AllowOrigin")]
public class CodeController : ControllerBase
{
    private readonly Judge0Service _judge0Service;
    private readonly CapDbContext _context;

    public CodeController(Judge0Service judge0Service, CapDbContext context)
    {
        _judge0Service = judge0Service;
        _context = context;
    }

    [HttpPost("execute/{questionId}")]
    public async Task<IActionResult> ExecuteCode(int questionId, [FromBody] CodeExecutionDto dto)
    {
        var codingQuestion = await _context.CodingQuestions
            .Include(q => q.TestCases)
            .FirstOrDefaultAsync(q => q.QuestionId == questionId);

        if (codingQuestion is null)
        {
            return NotFound(new { message = "Question not found" });
        }

        var testResults = new List<TestCaseResultDto>();

        foreach (var testCase in codingQuestion.TestCases)
        {
            Type inputType = InferInputType(testCase.ExpectedOutput);
            string stdinInput;

            // Handle input formatting based on type
            if (inputType == typeof(int))
            {
                stdinInput = string.Join(" ", testCase.Inputs.Select(i => int.Parse(i).ToString()));
            }
            else if (inputType == typeof(double))
            {
                stdinInput = string.Join(" ", testCase.Inputs.Select(i => double.Parse(i).ToString()));
            }
            else // string
            {
                // If single string, pass directly; else join with spaces
                stdinInput = testCase.Inputs.Count == 1 ? testCase.Inputs[0] : string.Join(" ", testCase.Inputs);
            }

            string wrappedCode = WrapUserCode(dto!.SourceCode, testCase.Inputs, dto.LanguageId, inputType);
            var (output, error) = await _judge0Service.SubmitCodeAsync(wrappedCode, dto.LanguageId, stdinInput);

            testResults.Add(new TestCaseResultDto
            {
                Inputs = testCase.Inputs,
                ExpectedOutput = testCase.ExpectedOutput,
                ActualOutput = output,
                Error = error
            });
        }

        return Ok(testResults);
    }

    private string WrapUserCode(string userCode, List<string> inputs, int languageId, Type inputType)
    {
        switch (languageId)
        {
            case 71: // Python
                return WrapPythonCode(userCode, inputs, inputType);
            case 63: // JavaScript (Node.js)
                return WrapJavaScriptCode(userCode, inputs, inputType);
            case 74: // TypeScript
                return WrapTypeScriptCode(userCode, inputs, inputType);
            default:
                throw new NotSupportedException("Language not supported");
        }
    }
    
    private string WrapJavaScriptCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => (char)('a' + i)));

        // Add type conversion for numbers
        string conversion = "";
        if (inputType == typeof(int) || inputType == typeof(double))
        {
            conversion = $".map(x => Number(x))"; // Convert inputs to numbers
        }

        return $@"
{userCode}

const [{inputVariables}] = require('fs').readFileSync(0, 'utf-8').trim().split(/\s+/){conversion};
console.log({functionName}({inputVariables}));
";
    }
    
    

    private string WrapPythonCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => (char)('a' + i)));

        // If single string input, pass directly (no splitting)
        if (inputType == typeof(string) && inputs.Count == 1)
        {
            return $@"
{userCode}

if __name__ == '__main__':
    a = input()  # Takes full input as a string
    print({functionName}(a))
";
        }

        // Handle numbers/lists
        string conversionLogic = inputType == typeof(int) ? "map(int, input().split())" :
                               inputType == typeof(double) ? "map(float, input().split())" :
                               "input().split()";

        return $@"
{userCode}

if __name__ == '__main__':
    {inputVariables} = {conversionLogic}
    print({functionName}({inputVariables}))
";
    }


    private string WrapTypeScriptCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => (char)('a' + i)));

        string conversion = "";
        if (inputType == typeof(int) || inputType == typeof(double))
        {
            conversion = ".map(x => Number(x))";
        }

        return $@"
// TypeScript code with Node.js declarations
declare function require(module: string): any;

{userCode}

// Main execution
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
const [{inputVariables}] = input.split(/\s+/){conversion};
console.log({functionName}({inputVariables}));
";
    }




    private Type InferInputType(string expectedOutput)
    {
        if (int.TryParse(expectedOutput, out _))
        {
            return typeof(int);
        }
        else if (double.TryParse(expectedOutput, out _))
        {
            return typeof(double);
        }
        else
        {
            return typeof(string);
        }
    }


    private string ExtractFunctionName(string userCode)
    {
        // Covers: function add(...), const add = (...), let add = (...), var add = (...) and even def add(...) for Python
        var match = Regex.Match(userCode, @"(?:def\s+|function\s+|const\s+|let\s+|var\s+)?(\w+)\s*(?:=|\()");
        if (match.Success)
            return match.Groups[1].Value;

        throw new ArgumentException("Function definition not found in the code.");
    }
}
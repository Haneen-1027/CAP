using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Data;
using CapApi.Dtos.Code;
using CapApi.Services.Judge0;
using Microsoft.AspNetCore.Cors;
using System.Text.RegularExpressions;
using System.Linq;
using CapApi.Models;
using System.Collections.Concurrent;

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

        var testResults = new ConcurrentBag<TestCaseResultDto>();

        await Parallel.ForEachAsync(codingQuestion.TestCases, async (testCase, ct) =>
        {
            Type inputType = InferInputType(testCase.ExpectedOutput);
            string stdinInput = FormatInputForStdin(testCase.Inputs, inputType);
            string wrappedCode = WrapUserCode(dto!.SourceCode, testCase.Inputs, dto.LanguageId, inputType);

            var (output, error) = await _judge0Service.SubmitCodeAsync(wrappedCode, dto.LanguageId, stdinInput);

            testResults.Add(new TestCaseResultDto
            {
                Inputs = testCase.Inputs,
                ExpectedOutput = testCase.ExpectedOutput,
                ActualOutput = output,
                Error = error
            });
        });

        return Ok(testResults.OrderBy(t => string.Join(",", t.Inputs)).ToList());
    }

    // --- Helper Methods ---

    private string WrapUserCode(string userCode, List<string> inputs, int languageId, Type inputType)
    {
        return languageId switch
        {
            71 => WrapPythonCode(userCode, inputs, inputType),    // Python
            63 => WrapJavaScriptCode(userCode, inputs, inputType), // JavaScript
            51 => WrapCSharpCode(userCode, inputs, inputType),     // C#
            _ => throw new NotSupportedException($"Language ID {languageId} is not supported.")
        };
    }

    private string WrapPythonCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => (char)('a' + i)));

        if (inputType == typeof(string) && inputs.Count == 1)
        {
            return $@"
{userCode}

if __name__ == '__main__':
    a = input()
    print({functionName}(a))
";
        }

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

    private string WrapJavaScriptCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => (char)('a' + i)));

        string conversion = inputType == typeof(int) || inputType == typeof(double) ? ".map(Number)" : "";

        return $@"
{userCode}

const [{inputVariables}] = require('fs').readFileSync(0, 'utf-8').trim().split(/\s+/){conversion};
console.log({functionName}({inputVariables}));
";
    }

    private string WrapCSharpCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractFunctionName(userCode);
        string inputVariables = string.Join(", ", inputs.Select((_, i) => $"arg{i + 1}"));

        // Generate input parsing logic
        string inputParsing = string.Join("\n        ", inputs.Select((_, i) => 
            $"var arg{i + 1} = {GetTypeConverter(inputType)}(args[{i}]);"));

        return $@"
using System;

{userCode}

public static class Program
{{
    public static void Main()
    {{
        string[] args = Console.ReadLine().Split();
        {inputParsing}
        var result = {functionName}({inputVariables});
        Console.WriteLine(result);
    }}
}}";

        string GetTypeConverter(Type type)
        {
            return type == typeof(int) ? "int.Parse" :
                type == typeof(double) ? "double.Parse" :
                ""; // No conversion for strings
        }
    }
    private string FormatInputForStdin(List<string> inputs, Type inputType)
    {
        if (inputType == typeof(string) && inputs.Count == 1)
        {
            return inputs[0]; // Pass string directly (no splitting)
        }
        return string.Join(" ", inputs); // Join with spaces for numbers/arrays
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
        // Python: def myFunc(...)
        var pythonMatch = Regex.Match(userCode, @"def\s+(\w+)\s*\(");
        if (pythonMatch.Success) return pythonMatch.Groups[1].Value;

        // JavaScript: function myFunc(...) or const myFunc = (...)
        var jsMatch = Regex.Match(userCode, @"(?:function|const|let|var)\s+(\w+)\s*[=(]");
        if (jsMatch.Success) return jsMatch.Groups[1].Value;

        // C#: public static T MyFunction(...)
        var csharpMatch = Regex.Match(userCode, @"(?:public\s+)?static\s+\w+\s+(\w+)\s*\(");
        if (csharpMatch.Success) return csharpMatch.Groups[1].Value;

        throw new ArgumentException("Function definition not found in the code.");
    }
}
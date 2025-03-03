using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Data;
using CapApi.Services;
using CapApi.DTOs;
using Microsoft.AspNetCore.Cors;

namespace CapApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors("AllowOrigin")]
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
                // Wrap the user's function with input/output logic
                string wrappedCode = WrapUserCode(dto!.SourceCode, testCase!.Inputs, dto.LanguageId);


                // Execute the wrapped code
                //var result = await _judge0Service.SubmitCodeAsync(wrappedCode, dto.LanguageId, string.Join(" ", testCase.Inputs));
                var (output, error) = await _judge0Service.SubmitCodeAsync(wrappedCode, dto.LanguageId, string.Join(" ", testCase.Inputs));                // Compare the actual output with the expected output
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

        private string WrapUserCode(string userCode, List<string> inputs, int languageId)
        {
            switch (languageId)
            {
                case 71: // Python
                    return WrapPythonCode(userCode, inputs);

                case 63: // JavaScript (Node.js)
                    Console.WriteLine(WrapJavaScriptCode(userCode, inputs));
                    return WrapJavaScriptCode(userCode, inputs);

                default:
                    throw new NotSupportedException("Language not supported");
            }
        }

        private string WrapPythonCode(string userCode, List<string> inputs)
        {
            string functionName = ExtractFunctionName(userCode);
            string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => (char)('a' + i)));
            return $@"
{userCode}

if __name__ == '__main__':
    {inputVariables} = input().split()
    print({functionName}({inputVariables}))
";
        }

        private string WrapJavaScriptCode(string userCode, List<string> inputs)
        {
            string functionName = ExtractFunctionName(userCode);
            string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => $"input{i + 1}"));

            return $@"
{userCode}

// Read input from stdin
let input = '';
process.stdin.on('data', (chunk) => {{
    input += chunk;
}});

process.stdin.on('end', () => {{
    const [{inputVariables}] = input.trim().split(' ');
    console.log({functionName}({inputVariables}));
}});
";
        }

        private string ExtractFunctionName(string userCode)
        {
            // Try to extract Python function name
            var pythonMatch = System.Text.RegularExpressions.Regex.Match(userCode, @"def\s+(\w+)\s*\(");
            if (pythonMatch.Success)
            {
                return pythonMatch.Groups[1].Value;
            }

            // Try to extract JavaScript function name
            var jsMatch = System.Text.RegularExpressions.Regex.Match(userCode, @"function\s+(\w+)\s*\(");
            if (jsMatch.Success)
            {
                return jsMatch.Groups[1].Value;
            }

            throw new ArgumentException("Function definition not found in the user's code.");
        }

        private string GenerateInputHandling(int inputCount, string functionName)
        {
            // Generate input variables (e.g., "s1, s2" for 2 inputs)
            string inputVariables = string.Join(", ", Enumerable.Range(0, inputCount).Select(i => $"s{i + 1}"));

            // Generate the input handling logic

            return $@"
if __name__ == '__main__':
    {inputVariables} = input().split()
    print({functionName}({inputVariables}))
";
        }


    }

}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Data;
using CapApi.Services;
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

        //    [HttpPost("execute/{questionId}")]
        //    public async Task<IActionResult> ExecuteCode(int questionId, [FromBody] CodeExecutionRequest request)
        //    {
        //        var codingQuestion = await _context.CodingQuestions
        //            .Include(q => q.TestCases)
        //            .FirstOrDefaultAsync(q => q.QuestionId == questionId);

        //        if (codingQuestion == null)
        //        {
        //            return NotFound(new { message = "Question not found" });
        //        }

        //        var testResults = new List<TestCaseResult>();

        //        foreach (var testCase in codingQuestion.TestCases)
        //        {
        //            //var result = await _judge0Service.SubmitCodeAsync(request.SourceCode, request.LanguageId, string.Join("\n", testCase.Inputs));

        //            var result = await _judge0Service.SubmitCodeAsync(request.SourceCode, request.LanguageId, string.Join(" ", testCase.Inputs));


        //            testResults.Add(new TestCaseResult
        //            {
        //                Inputs = testCase.Inputs,
        //                ExpectedOutput = testCase.ExpectedOutput,
        //                ActualOutput = result
        //            });
        //        }

        //        return Ok(testResults);
        //    }
        //


        //[HttpPost("execute/{questionId}")]
        //public async Task<IActionResult> ExecuteCode(int questionId, [FromBody] CodeExecutionRequest request)
        //{
        //    var codingQuestion = await _context.CodingQuestions
        //        .Include(q => q.TestCases)
        //        .FirstOrDefaultAsync(q => q.QuestionId == questionId);

        //    if (codingQuestion == null)
        //    {
        //        return NotFound(new { message = "Question not found" });
        //    }

        //    var testResults = new List<TestCaseResult>();

        //    foreach (var testCase in codingQuestion.TestCases)
        //    {
        //        // Prepare the input for the user's code
        //        var input = string.Join(" ", testCase.Inputs);

        //        // Execute the user's code with the test case input
        //        var result = await _judge0Service.SubmitCodeAsync(request.SourceCode, request.LanguageId, input);

        //        // Compare the actual output with the expected output
        //        testResults.Add(new TestCaseResult
        //        {
        //            Inputs = testCase.Inputs,
        //            ExpectedOutput = testCase.ExpectedOutput,
        //            ActualOutput = result
        //        });
        //    }

        //    return Ok(testResults);
        //}


        [HttpPost("execute/{questionId}")]
        public async Task<IActionResult> ExecuteCode(int questionId, [FromBody] CodeExecutionRequest request)
        {
            var codingQuestion = await _context.CodingQuestions
                .Include(q => q.TestCases)
                .FirstOrDefaultAsync(q => q.QuestionId == questionId);

            if (codingQuestion is null)
            {
                return NotFound(new { message = "Question not found" });
            }

            var testResults = new List<TestCaseResult>();

            foreach (var testCase in codingQuestion.TestCases)
            {
                // Wrap the user's function with input/output logic
                string wrappedCode = WrapUserCode(request.SourceCode, testCase.Inputs, request.LanguageId);


                // Execute the wrapped code
                var result = await _judge0Service.SubmitCodeAsync(wrappedCode, request.LanguageId, string.Join(" ", testCase.Inputs));

                // Compare the actual output with the expected output
                testResults.Add(new TestCaseResult
                {
                    Inputs = testCase.Inputs,
                    ExpectedOutput = testCase.ExpectedOutput,
                    ActualOutput = result
                });
            }

            return Ok(testResults);
        }



        //private string WrapUserCode(string userCode, List<string> inputs, int languageId)
        //{
        //    // Extract the function name (assumes the user writes a single function)
        //    string functionName = ExtractFunctionName(userCode);

        //    // Generate the input handling logic dynamically
        //    string inputHandling = GenerateInputHandling(inputs.Count, functionName);

        //    // Combine the user's code with the input handling logic
        //    Console.WriteLine($"{userCode}\n{inputHandling}");
        //    return $"{userCode}\n{inputHandling}";
        //}

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
        //private string ExtractFunctionName(string userCode)
        //{
        //    // Simple regex to extract the function name (e.g., "def add(a, b):" -> "add")
        //    var match = System.Text.RegularExpressions.Regex.Match(userCode, @"def\s+(\w+)\s*\(");
        //    if (match.Success)
        //    {
        //        return match.Groups[1].Value;
        //    }
        //    throw new ArgumentException("Function definition not found in the user's code.");
        //}

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

    public class CodeExecutionRequest
    {
        public string? SourceCode { get; set; }
        public int LanguageId { get; set; }
    }

    public class TestCaseResult
    {
        public List<string>? Inputs { get; set; }
        public string? ExpectedOutput { get; set; }
        public string? ActualOutput { get; set; }
    }
}

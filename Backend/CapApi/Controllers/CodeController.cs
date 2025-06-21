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
using Microsoft.VisualBasic;
using System.Runtime.Intrinsics.X86;

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
            //Type inputType = InferInputType(testCase.ExpectedOutput);
            Type inputType = InferInputType(testCase.Inputs.First());

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
            case 51: // C#
                return WrapCSharpCode(userCode, inputs, inputType);
            case 54: // C++
                return WrapCppCode(userCode, inputs, inputType);
            case 60: // Go (Golang)
                return WrapGoCode(userCode, inputs, inputType);
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


    private string WrapGoCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractGoFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => $"arg{i}"));

        // Format the user's code with proper Go syntax
        //userCode = FormatGoCode(userCode);

        string inputParsing = "";
        if (inputType == typeof(int))
        {
            inputParsing = string.Join("\n", Enumerable.Range(0, inputs.Count).Select(i =>
                $"\targ{i}, err := strconv.Atoi(inputs[{i}])\n\tif err != nil {{\n\t\tfmt.Println(\"Invalid input\")\n\t\treturn\n\t}}"));
        }
        else if (inputType == typeof(double))
        {
            inputParsing = string.Join("\n", Enumerable.Range(0, inputs.Count).Select(i =>
                $"\targ{i}, err := strconv.ParseFloat(inputs[{i}], 64)\n\tif err != nil {{\n\t\tfmt.Println(\"Invalid input\")\n\t\treturn\n\t}}"));
        }

        return $@"package main

import (
	""bufio""
	""fmt""
	""os""
	""strings""
	""strconv""
)

{userCode}

func main() {{
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	input := scanner.Text()
	inputs := strings.Fields(input)
	
{inputParsing}
	
	result := {functionName}({inputVariables})
	fmt.Println(result)
}}";
    }


    private string WrapCSharpCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractCSharpFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => $"arg{i}"));

        // Determine input parsing logic
        string inputParsing = "";
        if (inputType == typeof(int))
        {
            inputParsing = string.Join("\n", Enumerable.Range(0, inputs.Count).Select(i =>
                $"\t\tvar arg{i} = int.Parse(inputs[{i}]);"));
        }
        else if (inputType == typeof(double))
        {
            inputParsing = string.Join("\n", Enumerable.Range(0, inputs.Count).Select(i =>
                $"\t\tvar arg{i} = double.Parse(inputs[{i}]);"));
        }
        else
        {
            inputParsing = string.Join("\n", Enumerable.Range(0, inputs.Count).Select(i =>
                $"\t\tvar arg{i} = inputs[{i}];"));
        }

        return $@"using System;
using System.Linq;

public class Program
{{
    {MakeFunctionStatic(userCode)}

    static void Main()
    {{
        var inputs = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        
{inputParsing}
        
        var result = {functionName}({inputVariables});
        Console.WriteLine(result);
    }}
}}";
    }


    private string WrapCppCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractCppFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => $"arg{i}"));

        // Determine input parsing logic
        string inputParsing = "";
        if (inputType == typeof(int))
        {
            inputParsing = string.Join("\n", Enumerable.Range(0, inputs.Count).Select(i =>
                $"\tint arg{i} = stoi(inputs[{i}]);"));
        }
        else if (inputType == typeof(double))
        {
            inputParsing = string.Join("\n", Enumerable.Range(0, inputs.Count).Select(i =>
                $"\tdouble arg{i} = stod(inputs[{i}]);"));
        }
        else
        {
            inputParsing = string.Join("\n", Enumerable.Range(0, inputs.Count).Select(i =>
                $"\tstring arg{i} = inputs[{i}];"));
        }

        return $@"#include <iostream>
#include <string>
#include <vector>
#include <sstream>
using namespace std;

{userCode}

int main() {{
    string input;
    getline(cin, input);
    istringstream iss(input);
    vector<string> inputs;
    string token;
    
    while (iss >> token) {{
        inputs.push_back(token);
    }}
    
{inputParsing}
    
    auto result = {functionName}({inputVariables});
    cout << result << endl;
    return 0;
}}";
    }

    private string MakeFunctionStatic(string userCode)
    {
        // Insert "static" if it's missing
        var pattern = @"(?<prefix>(public|private|protected|internal)?\s*)(?<returnType>\w+)\s+(?<name>\w+)\s*\(";
        var replacement = "${prefix}static ${returnType} ${name}(";

        return Regex.Replace(userCode, pattern, replacement);
    }


    private string ExtractCSharpFunctionName(string userCode)
    {
        // Match C# method declarations like: public static int Add(int a, int b)
        var match = Regex.Match(userCode,
            @"(?:public\s+|private\s+|protected\s+|internal\s+)?(?:static\s+)?\w+\s+(\w+)\s*\(");

        if (match.Success)
            return match.Groups[1].Value;

        throw new ArgumentException("Function definition not found in the C# code.");
    }

    private string ExtractCppFunctionName(string userCode)
    {
        // Match C++ function declarations like: int add(int a, int b)
        var match = Regex.Match(userCode,
            @"\w+\s+(\w+)\s*\([^)]*\)\s*(?:const\s*)?(?:\{|;)");

        if (match.Success)
            return match.Groups[1].Value;

        throw new ArgumentException("Function definition not found in the C++ code.");
    }


    private string FormatGoCode(string userCode)
    {
        // Basic formatting for Go code
        userCode = userCode
            .Replace("{", "{\n\t")
            .Replace("}", "\n}")
            .Replace(";", "\n")
            .Replace("return ", "\treturn ");

        // Special handling for if statements
        if (userCode.Contains("if "))
        {
            userCode = userCode.Replace("if ", "\tif ");
        }

        return userCode;
    }




    private string ExtractGoFunctionName(string userCode)
    {
        // Match Go function declarations like: func add(a int, b int) int
        var match = Regex.Match(userCode, @"func\s+(\w+)\s*\(");
        if (match.Success)
            return match.Groups[1].Value;

        throw new ArgumentException("Function definition not found in the Go code.");
    }

    private Type InferInputType(string sample)
    {
        if (int.TryParse(sample, out _))
            return typeof(int);
        if (double.TryParse(sample, out _))
            return typeof(double);
        return typeof(string);
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
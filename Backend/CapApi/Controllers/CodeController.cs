using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Data;
using CapApi.Dtos.Code;
using CapApi.Services.Judge0;
using Microsoft.AspNetCore.Cors;
using System.Text.RegularExpressions;
using System.Linq;
using CapApi.Models;
using System;
using System.Collections.Generic;

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
            try
            {
                var inputType = InferInputType(testCase.Inputs.FirstOrDefault() ?? "");
                string stdinInput = FormatStdinInput(testCase.Inputs, inputType);

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
            catch (Exception ex)
            {
                testResults.Add(new TestCaseResultDto
                {
                    Inputs = testCase.Inputs,
                    ExpectedOutput = testCase.ExpectedOutput,
                    Error = $"Code wrapping failed: {ex.Message}"
                });
            }
        }

        return Ok(testResults);
    }

    private string FormatStdinInput(List<string> inputs, Type inputType)
    {
        if (inputs == null || inputs.Count == 0) return "";

        // Handle array inputs (should be provided as single JSON string)
        if (inputType.IsArray)
        {
            if (inputs.Count != 1)
            {
                throw new ArgumentException("Array input should be provided as a single string");
            }
            return inputs[0];
        }

        // Handle scalar inputs
        if (inputType == typeof(int))
        {
            return string.Join(" ", inputs.Select(i => int.Parse(i).ToString()));
        }
        else if (inputType == typeof(double))
        {
            return string.Join(" ", inputs.Select(i => double.Parse(i).ToString()));
        }
        else // string
        {
            return inputs.Count == 1 ? inputs[0] : string.Join(" ", inputs);
        }
    }

    private Type InferInputType(string sample)
    {
        if (string.IsNullOrEmpty(sample)) return typeof(string);
        
        // Check for array/list notation
        if (sample.StartsWith("[") && sample.EndsWith("]"))
        {
            string innerContent = sample.Trim('[', ']').Trim();
            if (string.IsNullOrEmpty(innerContent)) return typeof(object[]);
            
            string firstElement = innerContent.Split(',')[0].Trim();
            if (int.TryParse(firstElement, out _)) return typeof(int[]);
            if (double.TryParse(firstElement, out _)) return typeof(double[]);
            return typeof(string[]);
        }
        
        if (int.TryParse(sample, out _)) return typeof(int);
        if (double.TryParse(sample, out _)) return typeof(double);
        return typeof(string);
    }

    private string WrapUserCode(string userCode, List<string> inputs, int languageId, Type inputType)
    {
        if (string.IsNullOrWhiteSpace(userCode))
        {
            throw new ArgumentException("Source code cannot be empty");
        }

        try
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
                    throw new NotSupportedException($"Language ID {languageId} is not supported");
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to wrap {GetLanguageName(languageId)} code: {ex.Message}", ex);
        }
    }

    #region Language-Specific Wrappers

    // JavaScript
    private string WrapJavaScriptCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractFunctionName(userCode);
        var paramNames = ExtractFunctionParameters(userCode, "javascript");
        ValidateParameterCount(paramNames, inputs.Count);

        if (inputType.IsArray)
        {
            return $@"
{userCode}

const input = require('fs').readFileSync(0, 'utf-8').trim();
const {paramNames[0]} = JSON.parse(input);
console.log(JSON.stringify({functionName}({paramNames[0]})));
";
        }

        string conversion = GetJavaScriptTypeConversion(inputType);
        string inputVars = string.Join(", ", paramNames);

        return $@"
{userCode}

const input = require('fs').readFileSync(0, 'utf-8').trim();
const [{inputVars}] = input.split(/\s+/){conversion};
console.log({functionName}({inputVars}));
";
    }

    // TypeScript
    private string WrapTypeScriptCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractFunctionName(userCode);
        var paramNames = ExtractFunctionParameters(userCode, "typescript");
        ValidateParameterCount(paramNames, inputs.Count);

        if (inputType.IsArray)
        {
            return $@"
{userCode}

const input = require('fs').readFileSync(0, 'utf-8').trim();
const {paramNames[0]} = JSON.parse(input);
console.log(JSON.stringify({functionName}({paramNames[0]})));
";
        }

        string conversion = GetJavaScriptTypeConversion(inputType);
        string inputVars = string.Join(", ", paramNames);

        return $@"
{userCode}

const input = require('fs').readFileSync(0, 'utf-8').trim();
const [{inputVars}] = input.split(/\s+/){conversion};
console.log({functionName}({inputVars}));
";
    }

    // Python
    private string WrapPythonCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractFunctionName(userCode);
        var paramNames = ExtractFunctionParameters(userCode, "python");
        ValidateParameterCount(paramNames, inputs.Count);

        if (inputType.IsArray)
        {
            return $@"
{userCode}

import json
if __name__ == '__main__':
    {paramNames[0]} = json.loads(input())
    print(json.dumps({functionName}({paramNames[0]})))
";
        }
        else if (inputType == typeof(string) && inputs.Count == 1)
        {
            return $@"
{userCode}

if __name__ == '__main__':
    {paramNames[0]} = input()
    print({functionName}({paramNames[0]}))
";
        }

        string conversionLogic = GetPythonConversionLogic(inputType);
        return $@"
{userCode}

if __name__ == '__main__':
    {paramNames[0]} = {conversionLogic}
    print({functionName}({paramNames[0]}))
";
    }

    // C#
    private string WrapCSharpCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractCSharpFunctionName(userCode);
        var paramNames = ExtractFunctionParameters(userCode, "csharp");
        ValidateParameterCount(paramNames, inputs.Count);

        if (inputType.IsArray)
        {
            string elementType = inputType.GetElementType()?.Name ?? "object";
            return $@"
using System;
using System.Linq;
using System.Text.Json;

public class Program
{{
    {MakeFunctionStatic(userCode)}

    static void Main()
    {{
        string json = Console.ReadLine();
        {elementType}[] {paramNames[0]} = JsonSerializer.Deserialize<{elementType}[]>(json);
        var result = {functionName}({paramNames[0]});
        Console.WriteLine(JsonSerializer.Serialize(result));
    }}
}}";
        }

        string inputParsing = GetCSharpInputParsing(paramNames, inputType);
        string inputVars = string.Join(", ", paramNames);

        return $@"
using System;
using System.Linq;

public class Program
{{
    {MakeFunctionStatic(userCode)}

    static void Main()
    {{
        var inputs = Console.ReadLine()?.Split(new[] {{ ' ' }}, StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>();
        
        if (inputs.Length < {inputs.Count})
        {{
            Console.WriteLine(""Not enough inputs provided"");
            return;
        }}

{inputParsing}
        
        var result = {functionName}({inputVars});
        Console.WriteLine(result);
    }}
}}";
    }

    // C++
    private string WrapCppCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractCppFunctionName(userCode);
        var paramNames = ExtractFunctionParameters(userCode, "cpp");
        ValidateParameterCount(paramNames, inputs.Count);

        if (inputType.IsArray)
        {
            return $@"
#include <iostream>
#include <string>
#include <vector>
#include <nlohmann/json.hpp>
using json = nlohmann::json;

{userCode}

int main() {{
    std::string input;
    std::getline(std::cin, input);
    auto j = json::parse(input);
    std::vector<int> arr = j.get<std::vector<int>>();
    auto result = {functionName}(arr);
    std::cout << json(result).dump();
    return 0;
}}";
        }

        string inputParsing = GetCppInputParsing(paramNames, inputType);
        string inputVars = string.Join(", ", paramNames);

        return $@"
#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <stdexcept>
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
    
    if (inputs.size() < {inputs.Count}) {{
        cerr << ""Not enough inputs provided"" << endl;
        return 1;
    }}

{inputParsing}
    
    auto result = {functionName}({inputVars});
    cout << result << endl;
    return 0;
}}";
    }

    // Go
    private string WrapGoCode(string userCode, List<string> inputs, Type inputType)
    {
        string functionName = ExtractGoFunctionName(userCode);
        var paramNames = ExtractFunctionParameters(userCode, "go");
        ValidateParameterCount(paramNames, inputs.Count);

        if (inputType.IsArray)
        {
            return $@"package main

import (
	""encoding/json""
	""fmt""
	""os""
	""io/ioutil""
)

{userCode}

func main() {{
	data, _ := ioutil.ReadAll(os.Stdin)
	var {paramNames[0]} []int
	json.Unmarshal(data, &{paramNames[0]})
	result := {functionName}({paramNames[0]})
	jsonResult, _ := json.Marshal(result)
	fmt.Println(string(jsonResult))
}}";
        }

        string inputParsing = GetGoInputParsing(paramNames, inputType);
        string imports = GetGoRequiredImports(inputType);
        string inputVars = string.Join(", ", paramNames);

        return $@"package main

import (
	""bufio""
	""fmt""
	""os""
	""strings""
	{imports}
)

{userCode}

func main() {{
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	input := scanner.Text()
	inputs := strings.Fields(input)
	
{inputParsing}
	
	result := {functionName}({inputVars})
	fmt.Println(result)
}}";
    }

    #endregion

    #region Helper Methods

    private string GetLanguageName(int languageId)
    {
        return languageId switch
        {
            51 => "C#",
            54 => "C++",
            60 => "Go",
            71 => "Python",
            63 => "JavaScript",
            74 => "TypeScript",
            _ => $"Unknown (ID: {languageId})"
        };
    }

    private List<string> ExtractFunctionParameters(string userCode, string language)
    {
        string pattern = language switch
        {
            "javascript" or "typescript" => @"function\s+\w+\s*\(([^)]*)\)|const\s+\w+\s*=\s*\(([^)]*)\)|let\s+\w+\s*=\s*\(([^)]*)\)|var\s+\w+\s*=\s*\(([^)]*)\)",
            "python" => @"def\s+\w+\s*\(([^)]*)\)",
            "go" => @"func\s+\w+\s*\(([^)]*)\)",
            "csharp" => @"(?:public\s+|private\s+|protected\s+|internal\s+)?(?:static\s+)?\w+\s+\w+\s*\(([^)]*)\)",
            "cpp" => @"\w+\s+\w+\s*\(([^)]*)\)",
            _ => @"\w+\s*\(([^)]*)\)"
        };

        var match = Regex.Match(userCode, pattern);
        if (!match.Success) return new List<string> { "arg0" };

        string paramsGroup = match.Groups.Values.Skip(1).First(g => !string.IsNullOrEmpty(g.Value)).Value;
        var parameters = Regex.Split(paramsGroup, @",\s*")
            .Select(p => Regex.Match(p, @"^([^\s:]+)").Value)
            .Where(p => !string.IsNullOrEmpty(p))
            .ToList();

        return parameters.Any() ? parameters : new List<string> { "arg0" };
    }

    private void ValidateParameterCount(List<string> paramNames, int inputCount)
    {
        if (paramNames.Count != inputCount)
        {
            throw new ArgumentException(
                $"Function expects {paramNames.Count} parameters but test case provides {inputCount} inputs");
        }
    }

    private string ExtractFunctionName(string userCode)
    {
        var patterns = new[]
        {
            @"function\s+(\w+)\s*\(",          // JavaScript function
            @"def\s+(\w+)\s*\(",               // Python
            @"func\s+(\w+)\s*\(",              // Go
            @"\w+\s+(\w+)\s*\(",               // C++/C#
            @"(?:const|let|var)\s+(\w+)\s*=",  // JavaScript arrow function
            @"\b(\w+)\s*=\s*(?:function\s*\()" // JavaScript function expression
        };

        foreach (var pattern in patterns)
        {
            var match = Regex.Match(userCode, pattern);
            if (match.Success) return match.Groups[1].Value;
        }

        throw new ArgumentException("Could not determine function name from the code");
    }

    private string ExtractCSharpFunctionName(string userCode)
    {
        var match = Regex.Match(userCode,
            @"(?:public\s+|private\s+|protected\s+|internal\s+)?(?:static\s+)?\w+\s+(\w+)\s*\(");

        return match.Success ? match.Groups[1].Value : ExtractFunctionName(userCode);
    }

    private string ExtractCppFunctionName(string userCode)
    {
        var match = Regex.Match(userCode,
            @"\w+\s+(\w+)\s*\([^)]*\)\s*(?:const\s*)?(?:\{|;)");

        return match.Success ? match.Groups[1].Value : ExtractFunctionName(userCode);
    }

    private string ExtractGoFunctionName(string userCode)
    {
        var match = Regex.Match(userCode, @"func\s+(\w+)\s*\(");
        return match.Success ? match.Groups[1].Value : ExtractFunctionName(userCode);
    }

    private string MakeFunctionStatic(string userCode)
    {
        if (userCode.Contains(" static ")) return userCode;

        var pattern = @"(?<prefix>(public|private|protected|internal)?\s*)(?<returnType>\w+)\s+(?<name>\w+)\s*\(";
        var replacement = "${prefix}static ${returnType} ${name}(";

        return Regex.Replace(userCode, pattern, replacement);
    }

    private string GetJavaScriptTypeConversion(Type inputType)
    {
        return inputType == typeof(int) ? ".map(x => parseInt(x, 10))" :
               inputType == typeof(double) ? ".map(x => parseFloat(x))" :
               "";
    }

    private string GetPythonConversionLogic(Type inputType)
    {
        return inputType == typeof(int) ? "map(int, input().split())" :
               inputType == typeof(double) ? "map(float, input().split())" :
               "input().split()";
    }

    private string GetGoInputParsing(List<string> paramNames, Type inputType)
    {
        if (inputType == typeof(int))
        {
            return string.Join("\n", paramNames.Select((name, i) =>
                $"\t{name}, err := strconv.Atoi(inputs[{i}])\n\tif err != nil {{\n\t\tfmt.Println(\"Invalid integer input\")\n\t\tos.Exit(1)\n\t}}"));
        }
        else if (inputType == typeof(double))
        {
            return string.Join("\n", paramNames.Select((name, i) =>
                $"\t{name}, err := strconv.ParseFloat(inputs[{i}], 64)\n\tif err != nil {{\n\t\tfmt.Println(\"Invalid float input\")\n\t\tos.Exit(1)\n\t}}"));
        }
        else
        {
            if (paramNames.Count == 1)
            {
                return $"\t{paramNames[0]} := strings.Join(inputs, \" \")";
            }
            return string.Join("\n", paramNames.Select((name, i) =>
                $"\t{name} := inputs[{i}]"));
        }
    }

    private string GetGoRequiredImports(Type inputType)
    {
        return inputType == typeof(int) || inputType == typeof(double) ? "\"strconv\"" : "";
    }

    private string GetCSharpInputParsing(List<string> paramNames, Type inputType)
    {
        if (inputType == typeof(int))
        {
            return string.Join("\n", paramNames.Select((name, i) =>
                $"\tif (!int.TryParse(inputs[{i}], out var {name}))\n\t{{\n\t\tConsole.WriteLine(\"Invalid integer input\");\n\t\treturn;\n\t}}"));
        }
        else if (inputType == typeof(double))
        {
            return string.Join("\n", paramNames.Select((name, i) =>
                $"\tif (!double.TryParse(inputs[{i}], out var {name}))\n\t{{\n\t\tConsole.WriteLine(\"Invalid double input\");\n\t\treturn;\n\t}}"));
        }
        else
        {
            return string.Join("\n", paramNames.Select((name, i) =>
                $"\tvar {name} = inputs.Length > {i} ? inputs[{i}] : \"\";"));
        }
    }

    private string GetCppInputParsing(List<string> paramNames, Type inputType)
    {
        if (inputType == typeof(int))
        {
            return string.Join("\n", paramNames.Select((name, i) =>
                $"\tint {name};\n\ttry {{\n\t\t{name} = stoi(inputs[{i}]);\n\t}} catch (...) {{\n\t\tcerr << \"Invalid integer input\" << endl;\n\t\treturn 1;\n\t}}"));
        }
        else if (inputType == typeof(double))
        {
            return string.Join("\n", paramNames.Select((name, i) =>
                $"\tdouble {name};\n\ttry {{\n\t\t{name} = stod(inputs[{i}]);\n\t}} catch (...) {{\n\t\tcerr << \"Invalid double input\" << endl;\n\t\treturn 1;\n\t}}"));
        }
        else
        {
            return string.Join("\n", paramNames.Select((name, i) =>
                $"\tstring {name} = inputs.size() > {i} ? inputs[{i}] : \"\";"));
        }
    }

    #endregion
}
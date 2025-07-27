using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapApi.Data;
using CapApi.Dtos.Code;
using CapApi.Services.Judge0;
using Microsoft.AspNetCore.Cors;
using System.Text.RegularExpressions;
using System.Linq;
using CapApi.Models;
using System.Text.Json;
using System.Globalization;

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
            var inputTypes = InferInputTypes(testCase.Inputs);
            string stdinInput = FormatInputForLanguage(testCase.Inputs, inputTypes, dto.LanguageId);

            string wrappedCode = WrapUserCode(dto!.SourceCode, testCase.Inputs, dto.LanguageId, inputTypes);
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

    private List<Type> InferInputTypes(List<string> inputs)
    {
        var types = new List<Type>();

        foreach (var input in inputs)
        {
            types.Add(InferSingleInputType(input));
        }

        return types;
    }

    private Type InferSingleInputType(string input)
    {
        // Check for boolean first (case-insensitive)
        if (bool.TryParse(input, out _))
            return typeof(bool);

        // Check for array/list (JSON format)
        if (input.Trim().StartsWith("[") && input.Trim().EndsWith("]"))
        {
            try
            {
                var jsonArray = JsonSerializer.Deserialize<JsonElement>(input);
                if (jsonArray.ValueKind == JsonValueKind.Array)
                {
                    // Determine array element type from first element
                    if (jsonArray.GetArrayLength() > 0)
                    {
                        var firstElement = jsonArray[0];
                        return firstElement.ValueKind switch
                        {
                            JsonValueKind.Number when firstElement.TryGetInt32(out _) => typeof(int[]),
                            JsonValueKind.Number => typeof(double[]),
                            JsonValueKind.String => typeof(string[]),
                            JsonValueKind.True or JsonValueKind.False => typeof(bool[]),
                            _ => typeof(string[])
                        };
                    }
                    return typeof(string[]); // Default for empty arrays
                }
            }
            catch
            {
                // If JSON parsing fails, treat as string
            }
        }

        // Check for integer
        if (int.TryParse(input, out _))
            return typeof(int);

        // Check for double
        if (double.TryParse(input, NumberStyles.Float, CultureInfo.InvariantCulture, out _))
            return typeof(double);

        // Default to string
        return typeof(string);
    }

    private string FormatInputForLanguage(List<string> inputs, List<Type> inputTypes, int languageId)
    {
        switch (languageId)
        {
            case 51: // C#
            case 54: // C++
            case 60: // Go
                return FormatInputForCompiledLanguages(inputs, inputTypes);
            case 71: // Python
            case 63: // JavaScript
            case 74: // TypeScript
                return FormatInputForScriptLanguages(inputs, inputTypes);
            default:
                return string.Join(" ", inputs);
        }
    }

    private string FormatInputForCompiledLanguages(List<string> inputs, List<Type> inputTypes)
    {
        var formattedInputs = new List<string>();

        for (int i = 0; i < inputs.Count; i++)
        {
            var input = inputs[i];
            var type = inputTypes[i];

            if (type == typeof(bool))
            {
                formattedInputs.Add(input.ToLower());
            }
            else if (type.IsArray)
            {
                // For arrays, we'll pass them as JSON and parse in the wrapper
                formattedInputs.Add(input);
            }
            else
            {
                formattedInputs.Add(input);
            }
        }

        return string.Join("\n", formattedInputs);
    }

    private string FormatInputForScriptLanguages(List<string> inputs, List<Type> inputTypes)
    {
        return string.Join("\n", inputs);
    }

    private string WrapUserCode(string userCode, List<string> inputs, int languageId, List<Type> inputTypes)
    {
        switch (languageId)
        {
            case 51: // C#
                return WrapCSharpCode(userCode, inputs, inputTypes);
            case 54: // C++
                return WrapCppCode(userCode, inputs, inputTypes);
            case 60: // Go
                return WrapGoCode(userCode, inputs, inputTypes);
            case 71: // Python
                return WrapPythonCode(userCode, inputs, inputTypes);
            case 63: // JavaScript
                return WrapJavaScriptCode(userCode, inputs, inputTypes);
            case 74: // TypeScript
                return WrapTypeScriptCode(userCode, inputs, inputTypes);
            default:
                throw new NotSupportedException("Language not supported");
        }
    }

    private string WrapCSharpCode(string userCode, List<string> inputs, List<Type> inputTypes)
    {
        string functionName = ExtractCSharpFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => $"arg{i}"));

        var inputParsing = new List<string>();
        var usingStatements = new List<string> { "using System;", "using System.Linq;", "using System.Text.Json;" };

        for (int i = 0; i < inputs.Count; i++)
        {
            var type = inputTypes[i];

            if (type == typeof(int))
            {
                inputParsing.Add($"\t\tvar arg{i} = int.Parse(inputs[{i}]);");
            }
            else if (type == typeof(double))
            {
                inputParsing.Add($"\t\tvar arg{i} = double.Parse(inputs[{i}]);");
            }
            else if (type == typeof(bool))
            {
                inputParsing.Add($"\t\tvar arg{i} = bool.Parse(inputs[{i}]);");
            }
            else if (type == typeof(int[]))
            {
                inputParsing.Add($"\t\tvar arg{i} = JsonSerializer.Deserialize<int[]>(inputs[{i}]);");
            }
            else if (type == typeof(double[]))
            {
                inputParsing.Add($"\t\tvar arg{i} = JsonSerializer.Deserialize<double[]>(inputs[{i}]);");
            }
            else if (type == typeof(string[]))
            {
                inputParsing.Add($"\t\tvar arg{i} = JsonSerializer.Deserialize<string[]>(inputs[{i}]);");
            }
            else if (type == typeof(bool[]))
            {
                inputParsing.Add($"\t\tvar arg{i} = JsonSerializer.Deserialize<bool[]>(inputs[{i}]);");
            }
            else // string
            {
                inputParsing.Add($"\t\tvar arg{i} = inputs[{i}];");
            }
        }

        return $@"{string.Join("\n", usingStatements)}

public class Program
{{
    {MakeFunctionStatic(userCode)}

    static void Main()
    {{
        var inputs = Console.In.ReadToEnd().Split('\n', StringSplitOptions.RemoveEmptyEntries);

{string.Join("\n", inputParsing)}

        var result = {functionName}({inputVariables});
        Console.WriteLine(result);
    }}
}}";
    }

    private string WrapCppCode(string userCode, List<string> inputs, List<Type> inputTypes)
    {
        string functionName = ExtractCppFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => $"arg{i}"));

        var inputParsing = new List<string>();
        var includes = new List<string>
        {
            "#include <iostream>",
            "#include <string>",
            "#include <vector>",
            "#include <sstream>",
            "#include <algorithm>",
            "#include <cctype>"
        };

        for (int i = 0; i < inputs.Count; i++)
        {
            var type = inputTypes[i];

            if (type == typeof(int))
            {
                inputParsing.Add($"    int arg{i} = stoi(inputs[{i}]);");
            }
            else if (type == typeof(double))
            {
                inputParsing.Add($"    double arg{i} = stod(inputs[{i}]);");
            }
            else if (type == typeof(bool))
            {
                inputParsing.Add($@"    bool arg{i} = (inputs[{i}] == ""true"");");
            }
            else if (type == typeof(int[]))
            {
                inputParsing.Add($@"    vector<int> arg{i};
    {{
        string arrayStr = inputs[{i}];
        // Remove brackets and spaces
        arrayStr = arrayStr.substr(1, arrayStr.length() - 2);
        if (!arrayStr.empty()) {{
            stringstream ss(arrayStr);
            string item;
            while (getline(ss, item, ',')) {{
                // Remove leading/trailing whitespace
                item.erase(0, item.find_first_not_of("" \t""));
                item.erase(item.find_last_not_of("" \t"") + 1);
                if (!item.empty()) {{
                    arg{i}.push_back(stoi(item));
                }}
            }}
        }}
    }}");
            }
            else if (type == typeof(double[]))
            {
                inputParsing.Add($@"    vector<double> arg{i};
    {{
        string arrayStr = inputs[{i}];
        // Remove brackets and spaces
        arrayStr = arrayStr.substr(1, arrayStr.length() - 2);
        if (!arrayStr.empty()) {{
            stringstream ss(arrayStr);
            string item;
            while (getline(ss, item, ',')) {{
                // Remove leading/trailing whitespace
                item.erase(0, item.find_first_not_of("" \t""));
                item.erase(item.find_last_not_of("" \t"") + 1);
                if (!item.empty()) {{
                    arg{i}.push_back(stod(item));
                }}
            }}
        }}
    }}");
            }
            else if (type == typeof(string[]))
            {
                inputParsing.Add($@"    vector<string> arg{i};
    {{
        string arrayStr = inputs[{i}];
        // Remove brackets
        arrayStr = arrayStr.substr(1, arrayStr.length() - 2);
        if (!arrayStr.empty()) {{
            stringstream ss(arrayStr);
            string item;
            while (getline(ss, item, ',')) {{
                // Remove leading/trailing whitespace
                item.erase(0, item.find_first_not_of("" \t""));
                item.erase(item.find_last_not_of("" \t"") + 1);
                // Remove quotes if present
                if (item.length() >= 2 && item[0] == '""' && item[item.length()-1] == '""') {{
                    item = item.substr(1, item.length() - 2);
                }}
                if (!item.empty()) {{
                    arg{i}.push_back(item);
                }}
            }}
        }}
    }}");
            }
            else if (type == typeof(bool[]))
            {
                inputParsing.Add($@"    vector<bool> arg{i};
    {{
        string arrayStr = inputs[{i}];
        // Remove brackets and spaces
        arrayStr = arrayStr.substr(1, arrayStr.length() - 2);
        if (!arrayStr.empty()) {{
            stringstream ss(arrayStr);
            string item;
            while (getline(ss, item, ',')) {{
                // Remove leading/trailing whitespace
                item.erase(0, item.find_first_not_of("" \t""));
                item.erase(item.find_last_not_of("" \t"") + 1);
                if (!item.empty()) {{
                    arg{i}.push_back(item == ""true"");
                }}
            }}
        }}
    }}");
            }
            else // string
            {
                inputParsing.Add($"    string arg{i} = inputs[{i}];");
            }
        }

        return $@"{string.Join("\n", includes)}

using namespace std;

{userCode}

int main() {{
    vector<string> inputs;
    string line;
    while (getline(cin, line)) {{
        inputs.push_back(line);
    }}

{string.Join("\n", inputParsing)}

    auto result = {functionName}({inputVariables});
    cout << result << endl;
    return 0;
}}";
    }

    private string WrapGoCode(string userCode, List<string> inputs, List<Type> inputTypes)
    {
        string functionName = ExtractGoFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => $"arg{i}"));

        var inputParsing = new List<string>();
        var imports = new List<string> { "\"bufio\"", "\"fmt\"", "\"os\"" };

        // Track which additional packages we need
        bool needsStrings = false;
        bool needsStrconv = false;
        bool needsJson = false;

        for (int i = 0; i < inputs.Count; i++)
        {
            var type = inputTypes[i];

            if (type == typeof(int) || type == typeof(double) || type == typeof(bool))
            {
                needsStrconv = true;
                needsStrings = true;
            }
            else if (type.IsArray)
            {
                needsJson = true;
                needsStrings = true;
            }
            else if (type == typeof(string))
            {
                needsStrings = true;
            }
        }

        // Add additional packages only if needed
        if (needsStrings) imports.Add("\"strings\"");
        if (needsStrconv) imports.Add("\"strconv\"");
        if (needsJson) imports.Add("\"encoding/json\"");

        for (int i = 0; i < inputs.Count; i++)
        {
            var type = inputTypes[i];

            if (type == typeof(int))
            {
                inputParsing.Add($@"
    arg{i}, err := strconv.Atoi(strings.TrimSpace(inputs[{i}]))
    if err != nil {{
        fmt.Println(""Invalid integer input"")
        return
    }}");
            }
            else if (type == typeof(double))
            {
                inputParsing.Add($@"
    arg{i}, err := strconv.ParseFloat(strings.TrimSpace(inputs[{i}]), 64)
    if err != nil {{
        fmt.Println(""Invalid float input"")
        return
    }}");
            }
            else if (type == typeof(bool))
            {
                inputParsing.Add($@"
    arg{i}, err := strconv.ParseBool(strings.TrimSpace(inputs[{i}]))
    if err != nil {{
        fmt.Println(""Invalid boolean input"")
        return
    }}");
            }
            else if (type == typeof(int[]))
            {
                inputParsing.Add($@"
    var arg{i} []int
    err := json.Unmarshal([]byte(strings.TrimSpace(inputs[{i}])), &arg{i})
    if err != nil {{
        fmt.Println(""Invalid integer array input"")
        return
    }}");
            }
            else if (type == typeof(double[]))
            {
                inputParsing.Add($@"
    var arg{i} []float64
    err := json.Unmarshal([]byte(strings.TrimSpace(inputs[{i}])), &arg{i})
    if err != nil {{
        fmt.Println(""Invalid float array input"")
        return
    }}");
            }
            else if (type == typeof(string[]))
            {
                inputParsing.Add($@"
    var arg{i} []string
    err := json.Unmarshal([]byte(strings.TrimSpace(inputs[{i}])), &arg{i})
    if err != nil {{
        fmt.Println(""Invalid string array input"")
        return
    }}");
            }
            else if (type == typeof(bool[]))
            {
                inputParsing.Add($@"
    var arg{i} []bool
    err := json.Unmarshal([]byte(strings.TrimSpace(inputs[{i}])), &arg{i})
    if err != nil {{
        fmt.Println(""Invalid boolean array input"")
        return
    }}");
            }
            else // string
            {
                inputParsing.Add($@"
    arg{i} := strings.TrimSpace(inputs[{i}])");
            }
        }

        return $@"package main

import (
    {string.Join("\n    ", imports)}
)

{userCode}

func main() {{
    scanner := bufio.NewScanner(os.Stdin)
    var inputs []string

    for scanner.Scan() {{
        inputs = append(inputs, scanner.Text())
    }}

{string.Join("\n", inputParsing)}

    result := {functionName}({inputVariables})
    fmt.Println(result)
}}";
    }


    private string WrapPythonCode(string userCode, List<string> inputs, List<Type> inputTypes)
    {
        string functionName = ExtractFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => $"arg{i}"));

        var inputParsing = new List<string>();

        for (int i = 0; i < inputs.Count; i++)
        {
            var type = inputTypes[i];

            if (type == typeof(int))
            {
                inputParsing.Add($"arg{i} = int(inputs[{i}])");
            }
            else if (type == typeof(double))
            {
                inputParsing.Add($"arg{i} = float(inputs[{i}])");
            }
            else if (type == typeof(bool))
            {
                inputParsing.Add($"arg{i} = inputs[{i}].lower() == 'true'");
            }
            else if (type.IsArray)
            {
                inputParsing.Add($"arg{i} = json.loads(inputs[{i}])");
            }
            else // string
            {
                inputParsing.Add($"arg{i} = inputs[{i}]");
            }
        }

        return $@"import json
import sys

{userCode}

if __name__ == '__main__':
    inputs = []
    for line in sys.stdin:
        inputs.append(line.strip())

    {string.Join("\n    ", inputParsing)}

    result = {functionName}({inputVariables})
    print(result)";
    }

    private string WrapJavaScriptCode(string userCode, List<string> inputs, List<Type> inputTypes)
    {
        string functionName = ExtractFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => $"arg{i}"));

        var inputParsing = new List<string>();

        for (int i = 0; i < inputs.Count; i++)
        {
            var type = inputTypes[i];

            if (type == typeof(int))
            {
                inputParsing.Add($"const arg{i} = parseInt(inputs[{i}]);");
            }
            else if (type == typeof(double))
            {
                inputParsing.Add($"const arg{i} = parseFloat(inputs[{i}]);");
            }
            else if (type == typeof(bool))
            {
                inputParsing.Add($"const arg{i} = inputs[{i}].toLowerCase() === 'true';");
            }
            else if (type.IsArray)
            {
                inputParsing.Add($"const arg{i} = JSON.parse(inputs[{i}]);");
            }
            else // string
            {
                inputParsing.Add($"const arg{i} = inputs[{i}];");
            }
        }

        return $@"{userCode}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
const inputs = input.split('\n');

{string.Join("\n", inputParsing)}

console.log({functionName}({inputVariables}));";
    }

    private string WrapTypeScriptCode(string userCode, List<string> inputs, List<Type> inputTypes)
    {
        string functionName = ExtractFunctionName(userCode);
        string inputVariables = string.Join(", ", Enumerable.Range(0, inputs.Count).Select(i => $"arg{i}"));

        var inputParsing = new List<string>();

        for (int i = 0; i < inputs.Count; i++)
        {
            var type = inputTypes[i];

            if (type == typeof(int))
            {
                inputParsing.Add($"const arg{i}: number = parseInt(inputs[{i}]);");
            }
            else if (type == typeof(double))
            {
                inputParsing.Add($"const arg{i}: number = parseFloat(inputs[{i}]);");
            }
            else if (type == typeof(bool))
            {
                inputParsing.Add($"const arg{i}: boolean = inputs[{i}].toLowerCase() === 'true';");
            }
            else if (type == typeof(int[]))
            {
                inputParsing.Add($"const arg{i}: number[] = JSON.parse(inputs[{i}]);");
            }
            else if (type == typeof(double[]))
            {
                inputParsing.Add($"const arg{i}: number[] = JSON.parse(inputs[{i}]);");
            }
            else if (type == typeof(string[]))
            {
                inputParsing.Add($"const arg{i}: string[] = JSON.parse(inputs[{i}]);");
            }
            else if (type == typeof(bool[]))
            {
                inputParsing.Add($"const arg{i}: boolean[] = JSON.parse(inputs[{i}]);");
            }
            else // string
            {
                inputParsing.Add($"const arg{i}: string = inputs[{i}];");
            }
        }

        return $@"declare function require(module: string): any;

{userCode}

const fs = require('fs');
const input: string = fs.readFileSync(0, 'utf-8').trim();
const inputs: string[] = input.split('\n');

{string.Join("\n", inputParsing)}

console.log({functionName}({inputVariables}));";
    }

    // Helper methods
    private string MakeFunctionStatic(string userCode)
    {
        var pattern = @"(?<prefix>(public|private|protected|internal)?\s*)(?<returnType>\w+)\s+(?<name>\w+)\s*\(";
        var replacement = "${prefix}static ${returnType} ${name}(";
        return Regex.Replace(userCode, pattern, replacement);
    }

    private string ExtractCSharpFunctionName(string userCode)
    {
        var match = Regex.Match(userCode,
            @"(?:public\s+|private\s+|protected\s+|internal\s+)?(?:static\s+)?\w+\s+(\w+)\s*\(");

        if (match.Success)
            return match.Groups[1].Value;

        throw new ArgumentException("Function definition not found in the C# code.");
    }

    private string ExtractCppFunctionName(string userCode)
    {
        var match = Regex.Match(userCode,
            @"\w+\s+(\w+)\s*\([^)]*\)\s*(?:const\s*)?(?:\{|;)");

        if (match.Success)
            return match.Groups[1].Value;

        throw new ArgumentException("Function definition not found in the C++ code.");
    }

    private string ExtractGoFunctionName(string userCode)
    {
        var match = Regex.Match(userCode, @"func\s+(\w+)\s*\(");
        if (match.Success)
            return match.Groups[1].Value;

        throw new ArgumentException("Function definition not found in the Go code.");
    }

    private string ExtractFunctionName(string userCode)
    {
        var match = Regex.Match(userCode, @"(?:def\s+|function\s+|const\s+|let\s+|var\s+)?(\w+)\s*(?:=|\()");
        if (match.Success)
            return match.Groups[1].Value;

        throw new ArgumentException("Function definition not found in the code.");
    }
}
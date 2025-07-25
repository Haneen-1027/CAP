using System.Text;
using Newtonsoft.Json;

namespace CapApi.Services.Judge0;

public class Judge0Service
{
    private readonly HttpClient _httpClient;
    private const string Judge0BaseUrl = "https://judge0-ce.p.rapidapi.com";
    private const string SubmissionUrl = "/submissions";


    public Judge0Service(HttpClient httpClient)
    {
        _httpClient = httpClient;

        var apiKey = "52a5ad881bmsh7fd1284be127b85p19917ejsnaeb3458c5d01"; // Use your actual API key Haneen 1
        //var apiKey = "6b5a752a61msh25549ff2e206533p1c7be0jsn894d611c2a04"; // Use your actual API key Haneen 2
        //var apiKey = "6b5a752a61msh25549ff2e206533p1c7be0jsn894d611c2a04"; // Use your actual API key Eneirat
        _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", apiKey);
    }

    public async Task<(string Output, string Error)> SubmitCodeAsync(string sourceCode, int languageId, string input = "")
    {
        var requestBody = new
        {
            source_code = sourceCode,
            language_id = languageId,
            stdin = input
        };

        var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
        //var response = await _httpClient.PostAsync($"{Judge0BaseUrl}{SubmissionUrl}?base64_encoded=false&wait=true&fields=stdout,stderr,status", content);
        var response = await _httpClient.PostAsync($"{Judge0BaseUrl}{SubmissionUrl}?base64_encoded=false&wait=true&fields=stdout,stderr,status,compile_output", content);


        response.EnsureSuccessStatusCode();
        var resultString = await response.Content.ReadAsStringAsync();

        // Deserialize the response
        var result = JsonConvert.DeserializeObject<dynamic>(resultString);

        // Extract stdout and stderr
        string stdout = result.stdout?.ToString().Trim() ?? "";
        string stderr = result.stderr?.ToString().Trim() ?? "";
        string statusDescription = result.status?.description?.ToString().Trim() ?? "";
        string compileOutput = result.compile_output?.ToString().Trim() ?? "";

        // If there is an error, return it
        //if (!string.IsNullOrEmpty(stderr) || (statusDescription != "Accepted" && statusDescription != ""))
        //{
        //    string errorMessage = $"Error: {stderr}\nStatus: {statusDescription}";
        //    return (Output: "", Error: errorMessage);
        //}

        if (!string.IsNullOrEmpty(stderr) || !string.IsNullOrEmpty(compileOutput) || (statusDescription != "Accepted" && statusDescription != ""))
        {
            string errorMessage = $"Status: {statusDescription}\nCompile Error: {compileOutput}\nRuntime Error: {stderr}";
            return (Output: "", Error: errorMessage);
        }


        // If no error, return the output
        return (Output: stdout, Error: "");
    }
}
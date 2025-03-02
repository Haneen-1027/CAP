using System.Text;
using Newtonsoft.Json;

namespace CapApi.Services
{
    public class Judge0Service
    {
        private readonly HttpClient _httpClient;
        private const string Judge0BaseUrl = "https://judge0-ce.p.rapidapi.com";
        private const string SubmissionUrl = "/submissions";


        public Judge0Service(HttpClient httpClient)
        {
            _httpClient = httpClient;

            var apiKey = "52a5ad881bmsh7fd1284be127b85p19917ejsnaeb3458c5d01"; // Use your actual API key
            _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", apiKey);
        }



        //public async Task<string> SubmitCodeAsync(string sourceCode, int languageId, string input = "")
        //{
        //    var requestBody = new
        //    {
        //        source_code = sourceCode,
        //        language_id = languageId,
        //        stdin = input
        //    };

        //    var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

        //    var response = await _httpClient.PostAsync($"{Judge0BaseUrl}{SubmissionUrl}?base64_encoded=false&wait=true&fields=stdout,stderr,status", content);

        //    response.EnsureSuccessStatusCode();
        //    var result = await response.Content.ReadAsStringAsync();
        //    return result;
        //}


        public async Task<string> SubmitCodeAsync(string sourceCode, int languageId, string input = "")

        {
            var requestBody = new
            {
                source_code = sourceCode,
                language_id = languageId,
                stdin = input
            };

            var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"{Judge0BaseUrl}{SubmissionUrl}?base64_encoded=false&wait=true&fields=stdout,stderr,status", content);

            response.EnsureSuccessStatusCode();
            var resultString = await response.Content.ReadAsStringAsync();

            // Deserialize the response to extract stdout
            var result = JsonConvert.DeserializeObject<dynamic>(resultString);

            return result.stdout?.ToString().Trim() ?? "Error: " + result.stderr?.ToString();
        }
    }
}
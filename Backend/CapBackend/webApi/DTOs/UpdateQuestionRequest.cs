namespace webApi.DTOs;

public class UpdateQuestionRequest : AddQuestionRequest
{
    public int QuestionId { get; set; }
}
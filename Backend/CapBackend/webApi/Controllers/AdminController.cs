using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System;
using webApi.Models;

namespace webApi.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private static readonly List<Question> Questions = new List<Question>
        {
            new Question { Id = 1, AssessmentId = 1, Type = "MCQ", MaxScore = 10, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Question { Id = 2, AssessmentId = 2, Type = "Essay", MaxScore = 15, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
        };

        // 1. Add Question
        [HttpPost]
        public ActionResult<Question> AddQuestion([FromBody] Question newQuestion)
        {
            if (newQuestion == null)
            {
                return BadRequest("Question data is required.");
            }

            newQuestion.Id = Questions.Count > 0 ? Questions.Max(q => q.Id) + 1 : 1;
            newQuestion.CreatedAt = DateTime.UtcNow;
            newQuestion.UpdatedAt = DateTime.UtcNow;
            Questions.Add(newQuestion);

            return CreatedAtAction(nameof(GetQuestionById), new { id = newQuestion.Id }, newQuestion);
        }

        // 2. Update Question
        [HttpPut("{id}")]
        public ActionResult UpdateQuestion(int id, [FromBody] Question updatedQuestion)
        {
            var question = Questions.FirstOrDefault(q => q.Id == id);
            if (question == null)
            {
                return NotFound();
            }

            question.AssessmentId = updatedQuestion.AssessmentId;
            question.Type = updatedQuestion.Type;
            question.MaxScore = updatedQuestion.MaxScore;
            question.UpdatedAt = DateTime.UtcNow;

            return NoContent();
        }

        // 3. Delete Question
        [HttpDelete("{id}")]
        public ActionResult DeleteQuestion(int id)
        {
            var question = Questions.FirstOrDefault(q => q.Id == id);
            if (question == null)
            {
                return NotFound();
            }

            Questions.Remove(question);
            return NoContent();
        }

        // 4. Preview All Questions
        [HttpGet]
        public ActionResult<IEnumerable<Question>> GetAllQuestions()
        {
            return Ok(Questions);
        }

        // 5. Preview Questions by Category (AssessmentId)
        [HttpGet("by-category/{assessmentId}")]
        public ActionResult<IEnumerable<Question>> GetQuestionsByCategory(int assessmentId)
        {
            var filteredQuestions = Questions.Where(q => q.AssessmentId == assessmentId).ToList();
            if (!filteredQuestions.Any())
            {
                return NotFound();
            }

            return Ok(filteredQuestions);
        }

        // Additional: Get a specific question by ID
        [HttpGet("{id}")]
        public ActionResult<Question> GetQuestionById(int id)
        {
            var question = Questions.FirstOrDefault(q => q.Id == id);
            if (question == null)
            {
                return NotFound();
            }
            return Ok(question);
        }
    }

    // Mock Model for Question
//     public class Question
//     {
//         public int Id { get; set; }
//         public int AssessmentId { get; set; }
//         public string Type { get; set; }
//         public int MaxScore { get; set; }
//         public DateTime CreatedAt { get; set; }
//         public DateTime UpdatedAt { get; set; }
//     }
 }

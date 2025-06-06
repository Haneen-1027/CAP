﻿using System.ComponentModel.DataAnnotations;

namespace CapApi.Models;

public class McqQuestion
{
    public int Id { get; init; }
    public int QuestionId { get; init; }
    public Question? Question { get; init; }
    public int OptionsCount { get; set; }
    public bool? IsTrueFalse { get; set; }
    [MaxLength(100)] public List<string>? CorrectAnswer { get; set; }
    [MaxLength(100)] public List<string>? WrongOptions { get; set; }
}
namespace webApi.Models;

public class AdminSettings : BaseEntity
{
    public int Id { get; set; }
    public string Key { get; set; }
    public string Value { get; set; }
    
}
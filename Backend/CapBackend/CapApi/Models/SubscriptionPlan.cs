namespace CapApi.Models
{
    public abstract class SubscriptionPlan
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal Price { get; set; }
        public string? Features { get; set; }
        public int Duration { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<Organization>? Organizations { get; set; }
    }
}

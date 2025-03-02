using System.ComponentModel.DataAnnotations;

namespace CapApi.Models
{
    public abstract class Organization
    {
        public int Id { get; set; }
        [MaxLength(100)]
        public string? Name { get; set; }
        public int AddressId { get; set; }
        public string? ContactEmail { get; set; }
        public int SubscriptionPlanId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public SubscriptionPlan? SubscriptionPlan { get; set; }
        public ICollection<Recruiter>? Recruiters { get; set; }
    }
}

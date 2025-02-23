using System.Net;

namespace webApi.Models;

    public class Organization
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int AddressId { get; set; }
        public string ContactEmail { get; set; }
        public int SubscriptionPlanId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        //public Address Address { get; set; }
        public SubscriptionPlan SubscriptionPlan { get; set; }
        //public ICollection<Assessment> Assessments { get; set; }
        public ICollection<Recruiter> Recruiters { get; set; }
    }


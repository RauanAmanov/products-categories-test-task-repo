using System.Text.Json.Serialization;

namespace TestTaskApp.Models
{
    public class AdditionalField
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public int CategoryId { get; set; }

        [JsonIgnore]
        public Category? Category { get; set; }
    }
}

using System.Text.Json.Serialization;

namespace TestTaskApp.Models
{
    public class ProductAdditionalFieldValue
    {
        public int Id { get; set; }

        public int AdditionalFieldId { get; set; }

        [JsonIgnore]
        public AdditionalField? AdditionalField { get; set; }

        public int ProductId { get; set; }

        [JsonIgnore]
        public Product? Product { get; set; }

        public string? Value { get; set; }
    }
}

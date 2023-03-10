using System.ComponentModel.DataAnnotations;

namespace TestTaskApp.Models
{
    public class ProductModel
    {
        public int? Id { get; set; }

        [Required]
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";

        public IFormFile? Image { get; set; }

        public decimal Price { get; set; }

        public int CategoryId { get; set; }

        public Dictionary<int, string>? AdditionalFieldsValues { get; set; }
    }
}

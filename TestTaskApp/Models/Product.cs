using System.ComponentModel.DataAnnotations;

namespace TestTaskApp.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";

        public byte[]? Image { get; set; }

        public decimal Price { get; set; }

        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        public ICollection<ProductAdditionalFieldValue> ProductAdditionalFieldValues { get; set; }

        public Product()
        {
            ProductAdditionalFieldValues = new List<ProductAdditionalFieldValue>();
        }
    }
}

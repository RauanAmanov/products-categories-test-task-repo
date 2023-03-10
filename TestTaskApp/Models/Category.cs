using System.ComponentModel.DataAnnotations;

namespace TestTaskApp.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; } = "";

        public ICollection<AdditionalField> AdditionalFields { get; set; }

        public Category()
        {
            AdditionalFields = new List<AdditionalField>();
        }
    }
}

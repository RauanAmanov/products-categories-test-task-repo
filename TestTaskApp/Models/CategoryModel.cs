using System.ComponentModel.DataAnnotations;

namespace TestTaskApp.Models
{
    public class CategoryModel
    {
        [Required]
        public string? Name { get; set; } = "";

        public string[]? AdditionalFieldsNames { get; set; }
    }
}

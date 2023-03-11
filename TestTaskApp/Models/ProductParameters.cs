namespace TestTaskApp.Models
{
    public class ProductParameters
    {
        public int? CategoryIdFilter { get; set; }
        public Dictionary<int, string>? AdditionalFieldValuesFilter { get; set; } = null;
    }
}

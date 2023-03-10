using Microsoft.EntityFrameworkCore;

namespace TestTaskApp.Models
{
    public class ApplicationContext : DbContext
    {
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<AdditionalField> AdditionalFields { get; set; }
        public DbSet<ProductAdditionalFieldValue> ProductAdditionalFieldValues { get; set; }
        
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
        }
    }
}

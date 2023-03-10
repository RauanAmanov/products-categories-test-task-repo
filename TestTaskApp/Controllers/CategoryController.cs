using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestTaskApp.Models;

namespace TestTaskApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public CategoryController(ApplicationContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            return Ok(await _context.Categories.Include(x => x.AdditionalFields).ToListAsync());
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var category = await _context.Categories.Include(x => x.AdditionalFields).FirstOrDefaultAsync(x => x.Id == id);
            if (category == null)
                return BadRequest("Category not found");

            return Ok(category);
        }

        [HttpPost]
        public async Task<ActionResult> AddCategory([FromForm] CategoryModel categoryModel)
        {
            if (await _context.Categories.CountAsync(x => x.Name == categoryModel.Name) == 0)
            {
                var category = new Category { Name = categoryModel.Name };
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                if (categoryModel.AdditionalFieldsNames != null && categoryModel.AdditionalFieldsNames.Any())
                {
                    foreach (var item in categoryModel.AdditionalFieldsNames)
                        await _context.AdditionalFields.AddAsync(new AdditionalField { CategoryId = category.Id, Name = item });
                }

                await _context.SaveChangesAsync();
            }

            return Ok(await _context.Categories.Include(x => x.AdditionalFields).ToListAsync());
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return BadRequest("Category not found");

            _context.Categories.Remove(category);

            await _context.SaveChangesAsync();

            return Ok(await _context.Categories.Include(x => x.AdditionalFields).ToListAsync());
        }
    }
}

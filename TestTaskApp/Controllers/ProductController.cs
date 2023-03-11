using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using TestTaskApp.Models;

namespace TestTaskApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public ProductController(ApplicationContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> Get([FromQuery] ProductParameters productParameters)
        {
            IQueryable<Product> products = _context.Products.Include(x => x.Category).Include(x => x.ProductAdditionalFieldValues);

            if (productParameters.CategoryIdFilter.HasValue)
                products = products.Where(x => x.CategoryId == productParameters.CategoryIdFilter.Value);

            if (productParameters.AdditionalFieldValuesFilter != null)
            {
                foreach (var addFieldValueFilter in productParameters.AdditionalFieldValuesFilter)
                {
                    if (!string.IsNullOrWhiteSpace(addFieldValueFilter.Value))
                        products = products.Where(x => x.ProductAdditionalFieldValues.Any(e => e.AdditionalFieldId == addFieldValueFilter.Key &&
                        !string.IsNullOrWhiteSpace(e.Value) &&
                        e.Value.ToLower().Contains(addFieldValueFilter.Value.ToLower())));
                }
            }

            return Ok(await products.ToListAsync());
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var product = await _context.Products.Include(x => x.ProductAdditionalFieldValues).FirstOrDefaultAsync(x => x.Id == id);
            if (product == null)
                return BadRequest("Product not found");

            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult> AddProduct([FromForm] ProductModel productModel)
        {
            if (await _context.Products.CountAsync(x => x.Name == productModel.Name) == 0)
            {
                var product = new Product
                {
                    Name = productModel.Name,
                    Description = productModel.Description,
                    CategoryId = productModel.CategoryId,
                    Price = productModel.Price
                };

                if (productModel.Image != null)
                {
                    byte[] imageData = null;

                    using (var binaryReader = new BinaryReader(productModel.Image.OpenReadStream()))
                    {
                        imageData = binaryReader.ReadBytes((int)productModel.Image.Length);
                    }

                    product.Image = imageData;
                }

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                if (productModel.AdditionalFieldsValues != null && productModel.AdditionalFieldsValues.Any())
                {
                    foreach (var item in productModel.AdditionalFieldsValues)
                    {
                        await _context.ProductAdditionalFieldValues.AddAsync(new ProductAdditionalFieldValue
                        {
                            ProductId = product.Id,
                            AdditionalFieldId = item.Key,
                            Value = item.Value
                        });
                    }
                }

                await _context.SaveChangesAsync();
            }

            return Ok(await _context.Products.Include(x => x.ProductAdditionalFieldValues).ToListAsync());
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return BadRequest("Category not found");

            _context.Products.Remove(product);

            await _context.SaveChangesAsync();

            return Ok(await _context.Products.Include(x => x.ProductAdditionalFieldValues).ToListAsync());
        }
    }
}

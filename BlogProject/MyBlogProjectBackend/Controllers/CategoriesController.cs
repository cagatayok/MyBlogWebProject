using Microsoft.AspNetCore.Mvc;
using MyBlogProject.Context;

namespace MyBlogProject.Controllers
{

	[Route("api/[controller]")]
	[ApiController]
	public class CategoriesController : ControllerBase
	{
		private readonly MyBlogProjectDbContext _dbContext;

		public CategoriesController(MyBlogProjectDbContext dbContext)
		{
			_dbContext = dbContext;
		}
	

	[HttpGet("getAllCategories")]
		public IActionResult GetAllCategories()
		{
			var categories = _dbContext.Categories.ToList();
			if (categories == null || categories.Count == 0)
			{
				return NotFound("Sistemde henüz bir kategori bulunmuyor.");
			}

			return Ok(categories);
		}
	}
}
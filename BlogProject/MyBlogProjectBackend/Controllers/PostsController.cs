using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyBlogProject.Context;
using MyBlogProject.Models;
using Microsoft.AspNetCore.Authorization;


namespace MyBlogProject.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PostsController:ControllerBase
	{
		private readonly MyBlogProjectDbContext _dbContext;

		public PostsController(MyBlogProjectDbContext dbContext)
		{
			_dbContext = dbContext;
		}

		[HttpGet("getAllPosts")]
		public IActionResult GetAllPosts()
		{
			var posts = _dbContext.Posts.Include(p=>p.Category).ToList();
			return Ok(posts);
		}
		[HttpGet("getPostById/{id}")]
		public IActionResult GetPostById(int id)
		{
			// Gönderilen ID'ye sahip postu kategorisiyle birlikte bul
			var post = _dbContext.Posts.Include(p => p.Category).FirstOrDefault(x => x.Id == id);

			if (post == null)
			{
				return NotFound("Gönderi Bulunamadı");
			}
			return Ok(post);
		}
		[Authorize]
		[HttpPost("createPost")]

		public IActionResult CreatePost(Post post)
		{
			// Validasyon Kontrolleri
			if (string.IsNullOrEmpty(post.Title))
			{
				return BadRequest("Başlık alanı boş geçilemez.");
			}

			if (string.IsNullOrEmpty(post.BlogContent))
			{
				return BadRequest("İçerik alanı boş geçilemez.");
			}

			// Otomatik Değerleri Atıyoruz
			post.CreatedDate = DateTime.Now;

			// Veritabanına Kaydediyoruz
			try
			{
				_dbContext.Posts.Add(post);
				_dbContext.SaveChanges();
				return Ok("Blog Yazısı Başarıyla Eklendi.");
			}
			catch (Exception ex)
			{
				return BadRequest($"Bir hata oluştu: {ex.Message}");
			}
		}
		[Authorize]
		[HttpDelete("deletePost/{id}")]
		public IActionResult DeletePost(int id)
		{
			var post = _dbContext.Posts.Where(x => x.Id == id).FirstOrDefault();
			if (post == null)
			{
				return NotFound("Gönderi Bulunamadi");
			}
			_dbContext.Posts.Remove(post);
			_dbContext.SaveChanges();
			return Ok("Gönderi Silindi");
		}
		[Authorize]
		[HttpPut("updatePost")]
		public IActionResult UpdatePost(Post model)
		{
			var post = _dbContext.Posts.Where(x => x.Id == model.Id).FirstOrDefault();
			if (post == null)
			{
				return NotFound("Gönderi Bulunamadi");
			}
			post.Title = model.Title;
			post.BlogContent = model.BlogContent;
			post.CategoryId = model.CategoryId; 
			post.ImageUrl = model.ImageUrl;

			_dbContext.SaveChanges();
			return Ok("Gönderi Guncellendi");
		}

	}
}

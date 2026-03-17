using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyBlogProject.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize]
	public class ImagesController : ControllerBase
	{
		[HttpPost("upload")]
		// 1. DEĞİŞİKLİK: async Task<IActionResult> olarak değiştirdik
		public async Task<IActionResult> UploadImage(IFormFile file)
		{
			if (file == null || file.Length == 0)
			{
				return BadRequest("Lütfen bir dosya seçin");
			}

			var folderName = Path.Combine("wwwroot", "images");
			var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

			if (!Directory.Exists(pathToSave))
			{
				Directory.CreateDirectory(pathToSave);
			}

			var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
			var fullPath = Path.Combine(pathToSave, uniqueFileName);

			using (var stream = new FileStream(fullPath, FileMode.Create))
			{
				// 2. DEĞİŞİKLİK: await kelimesini ekledik. Artık kopyalama bitene kadar bekleyecek.
				await file.CopyToAsync(stream);
			}

			var dbPath = $"/images/{uniqueFileName}";

			return Ok(new { Url = dbPath, Message = "Resim başarıyla yüklendi." });
		}
	}
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyBlogProject.Context;
using MyBlogProject.DTOs; // DTO dosyamızı buradan içeri alıyoruz
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyBlogProject.Controllers
{
	[Route("api/[controller]")] // Swagger'ın görmesi için şart
	[ApiController]             // API olduğunu belirtiyoruz
	public class AuthController : ControllerBase
	{
		private readonly MyBlogProjectDbContext _dbContext;
		private readonly IConfiguration _configuration;

		public AuthController(MyBlogProjectDbContext dbContext, IConfiguration configuration)
		{
			_dbContext = dbContext;
			_configuration = configuration;
		}

		[HttpPost("login")]
		public IActionResult Login(UserLoginDto loginDto)
		{
			// 1. DİKKAT: Artık şifreyi SQL'de aramıyoruz! Önce sadece e-posta ile kullanıcıyı buluyoruz.
			var user = _dbContext.Users.FirstOrDefault(x => x.Email == loginDto.Email);

			// 2. Kullanıcı yoksa VEYA BCrypt ile şifre doğrulaması başarısız olursa hata ver
			if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
			{
				return Unauthorized("E-posta veya şifre hatalı.");
			}

			// Kullanıcı bulunduysa Token üret
			var tokenString = GenerateJwtToken(user);

			// Token'ı gönder
			return Ok(new { Token = tokenString, Message = "Giriş Başarılı" });
		}



		private string GenerateJwtToken(MyBlogProject.Models.User user)
		{
			var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
			var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

			var claims = new[]
			{
				new Claim(JwtRegisteredClaimNames.Sub, user.Email),
				new Claim(JwtRegisteredClaimNames.Email, user.Email),
				new Claim("UserId", user.Id.ToString())
			};

			var token = new JwtSecurityToken(
				issuer: _configuration["Jwt:Issuer"],
				audience: _configuration["Jwt:Audience"],
				claims: claims,
				expires: DateTime.Now.AddHours(2),
				signingCredentials: credentials);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
		
	}
}
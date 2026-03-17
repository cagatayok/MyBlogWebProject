using Microsoft.EntityFrameworkCore;
using MyBlogProject.Models;

namespace MyBlogProject.Context
{
	public class MyBlogProjectDbContext : DbContext
	{
		// Program.cs'den gelen bağlantı ayarlarını karşılayan Constructor
		public MyBlogProjectDbContext(DbContextOptions<MyBlogProjectDbContext> options) : base(options)
		{
		}

		public DbSet<User> Users { get; set; }
		public DbSet<Post> Posts { get; set; }
		public DbSet<Category> Categories { get; set; }

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			// Burası boş kalmalıdır. 
			// Çünkü bağlantı yönetimi artık Program.cs ve appsettings.json üzerinden yapılmaktadır.
		}
	}
}
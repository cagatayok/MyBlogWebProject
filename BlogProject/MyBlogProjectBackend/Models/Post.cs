using System.ComponentModel;

namespace MyBlogProject.Models
{
	public class Post
	{
		public int Id { get; set; }
		public string Title { get; set; }
		public string BlogContent { get; set; }
		public string ImageUrl { get; set; }
		public DateTime CreatedDate { get; set; }
		public int CategoryId { get; set; }
		public Category? Category { get; set; }
	}
}

namespace SPA.Domain.Entities;

public class Comment
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public Guid? ParentId { get; set; }
    public DateTime Created { get; set; }
    
    public User User { get; set; } = null!;
    public Comment? Parent { get; set; }
    public ICollection<Comment> Replies { get; set; } = new List<Comment>();
    public ICollection<File> Files { get; set; } = new List<File>();
}
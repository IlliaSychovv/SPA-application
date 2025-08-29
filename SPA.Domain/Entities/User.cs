namespace SPA.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Homepage { get; set; }
    
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
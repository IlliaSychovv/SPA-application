namespace SPA.Application.DTO.Comments;

public record CreateCommentDto
{
    public string Text { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Created { get; set; }
}
namespace SPA.Application.DTO.Comments;

public record CommentReplyDto
{
    public string Text { get; set; } = string.Empty; 
    public string Name { get; set; } = string.Empty;
}
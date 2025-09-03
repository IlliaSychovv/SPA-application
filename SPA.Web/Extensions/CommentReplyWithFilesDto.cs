namespace SPAApp.Extensions;

public record CommentReplyWithFilesDto
{
    public string Text { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty; 
    public List<IFormFile>? Files { get; set; }
}
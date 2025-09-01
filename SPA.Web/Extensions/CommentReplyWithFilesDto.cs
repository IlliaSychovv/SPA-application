namespace SPAApp;

public record CommentReplyWithFilesDto
{
    public string Text { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Created { get; set; }
    public List<IFormFile>? Files { get; set; }
}
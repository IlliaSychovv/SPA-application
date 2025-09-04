using Microsoft.AspNetCore.Http;

namespace SPA.Application.DTO.Comments;

public record CommentReplyWithFilesDto
{
    public string Text { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty; 
    public List<IFormFile>? Files { get; set; }
} 
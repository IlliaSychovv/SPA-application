namespace SPA.Application.DTO.Comments;

public record CreateCommentDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string? HomePage { get; set; } 
    public string Captcha { get; set; } = string.Empty;
    public string CaptchaSessionId { get; set; } = string.Empty;
}
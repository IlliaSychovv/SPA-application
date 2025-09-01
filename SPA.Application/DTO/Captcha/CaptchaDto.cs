namespace SPA.Application.DTO.Captcha;

public record CaptchaDto
{
    public string ImageBase64 { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
}
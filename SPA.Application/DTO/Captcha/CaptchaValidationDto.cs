namespace SPA.Application.DTO.Captcha;

public record CaptchaValidationDto
{
    public string Input { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
}
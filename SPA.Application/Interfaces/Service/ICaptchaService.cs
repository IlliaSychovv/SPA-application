using SPA.Application.DTO.Captcha;

namespace SPA.Application.Interfaces.Service;

public interface ICaptchaService
{
    Task<CaptchaDto> GenerateCaptchaAsync();
    Task<bool> ValidateCaptchaAsync(CaptchaValidationDto dto);
}
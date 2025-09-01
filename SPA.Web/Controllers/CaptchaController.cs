using Microsoft.AspNetCore.Mvc;
using SPA.Application.DTO.Captcha;
using SPA.Application.Interfaces.Service;

namespace SPAApp.Controllers;

[ApiController]
[Route("api/v1/captcha")]
public class CaptchaController : ControllerBase
{
    private readonly ICaptchaService _captchaService;

    public CaptchaController(ICaptchaService captchaService)
    {
        _captchaService = captchaService;
    }

    [HttpGet]
    public async Task<ActionResult<CaptchaDto>> GenerateCaptchaAsync()
    {
        var captcha = await _captchaService.GenerateCaptchaAsync();
        return Ok(captcha);
    }
}
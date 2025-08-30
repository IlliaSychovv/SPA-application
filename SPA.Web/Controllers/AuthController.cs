using Microsoft.AspNetCore.Mvc;
using SPA.Application.DTO.Users;
using SPA.Application.Interfaces.Service;

namespace SPAApp.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
    {
        var user = await _authService.RegisterAsync(dto);
        return Ok(user);
    }
}
using SPA.Application.DTO.Users;

namespace SPA.Application.Interfaces.Service;

public interface IAuthService
{
    Task<UserDto> RegisterAsync(RegisterUserDto dto);
}
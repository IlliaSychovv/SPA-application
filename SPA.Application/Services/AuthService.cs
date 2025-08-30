using Mapster;
using SPA.Application.DTO.Users;
using SPA.Application.Interfaces.Repository;
using SPA.Application.Interfaces.Service;
using SPA.Domain.Entities;

namespace SPA.Application.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;

    public AuthService(IAuthRepository authRepository)
    {
        _authRepository = authRepository;
    }

    public async Task<UserDto> RegisterAsync(RegisterUserDto dto)
    {
        var user = dto.Adapt<User>();
        user.Id = Guid.NewGuid();
        
        await _authRepository.RegisterUserAsync(user);
        return user.Adapt<UserDto>();
    }
}
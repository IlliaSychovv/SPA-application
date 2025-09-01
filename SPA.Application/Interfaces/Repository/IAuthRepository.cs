using SPA.Domain.Entities;

namespace SPA.Application.Interfaces.Repository;

public interface IAuthRepository
{
    Task RegisterUserAsync(User user);
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
}
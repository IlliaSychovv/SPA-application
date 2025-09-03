using SPA.Domain.Entities;

namespace SPA.Application.Interfaces.Repository;

public interface IAuthRepository
{
    Task RegisterUserAsync(User user); 
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUserNameAsync(string name);
}
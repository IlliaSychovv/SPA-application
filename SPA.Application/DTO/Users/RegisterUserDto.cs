namespace SPA.Application.DTO.Users;

public record RegisterUserDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Homepage { get; set; }
}
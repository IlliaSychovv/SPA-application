namespace SPA.Application.DTO.Files;

public record FileStreamData
{
    public Stream Stream { get; set; } = null!;
    public string FileName { get; set; } = string.Empty;
    public long Size { get; set; }
}
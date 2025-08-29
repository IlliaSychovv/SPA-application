namespace SPA.Domain.Entities;

public class File
{
    public Guid Id { get; set; }
    public Guid CommentId { get; set; }
    public string Path { get; set; } = string.Empty;
    public FileType Type { get; set; }
    public long Size { get; set; }

    public Comment Comment { get; set; } = null!;
}

public enum FileType
{
    Jpg,
    Gif,
    Png
}
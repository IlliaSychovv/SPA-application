using File = SPA.Domain.Entities.File;

namespace SPA.Application.Interfaces.Repository;

public interface IFileRepository
{
    Task<File> AddFileAsync(File file);
    Task<List<File>> GetFileByIdAsync(Guid commentId);
}
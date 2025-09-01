using SPA.Application.DTO.Files;
using File = SPA.Domain.Entities.File;

namespace SPA.Application.Interfaces.Service;

public interface IFileProcessingService
{
    Task<File> ProcessAndSaveFileAsync(FileStreamData fileData, Guid commentId);
}
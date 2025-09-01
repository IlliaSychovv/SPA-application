using SPA.Application.DTO.Files;
using SPA.Application.Interfaces.Repository;
using SPA.Application.Interfaces.Service;
using SPA.Domain.Entities;
using File = SPA.Domain.Entities.File;

namespace SPA.Infrastructure.Services;

public class FileProcessingService : IFileProcessingService
{
    private readonly IImportService _importService;
    private readonly IFileRepository _fileRepository;

    public FileProcessingService(IImportService importService, IFileRepository fileRepository)
    {
        _importService = importService;
        _fileRepository = fileRepository;
    }

    public async Task<File> ProcessAndSaveFileAsync(FileStreamData fileData, Guid commentId)
    {
        await _importService.ImportFileAsync(fileData.Stream, fileData.FileName);
        
        var fileEntity = new File
        {
            Id = Guid.NewGuid(),
            CommentId = commentId,
            Path = fileData.FileName,
            Type = GetFileType(Path.GetExtension(fileData.FileName)),
            Size = fileData.Size
        };

        await _fileRepository.AddFileAsync(fileEntity);
        
        return fileEntity;
    }
    
    private FileType GetFileType(string extension)
    {
        return extension.ToLowerInvariant() switch
        {
            ".jpg" or ".jpeg" => FileType.Jpg,
            ".gif" => FileType.Gif,
            ".png" => FileType.Png,
            ".txt" => FileType.Txt,
            _ => throw new ArgumentException($"Unsupported file type: {extension}")
        };
    }
}
namespace SPA.Application.Interfaces.Service;

public interface IImportService
{
    Task ImportFileAsync(Stream fileStream, string fileName);
}
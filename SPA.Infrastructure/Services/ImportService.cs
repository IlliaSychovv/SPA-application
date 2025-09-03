using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SPA.Application.Interfaces.Service;
using System.Text;

namespace SPA.Infrastructure.Services;

public class ImportService : IImportService
{
    private readonly ILogger<ImportService> _logger;
    private readonly string _imagePath = "wwwroot/uploads/images";
    private readonly string _textPath = "wwwroot/uploads/texts";

    private readonly Dictionary<string, Func<Stream, string, Task>> _handlers;

    public ImportService(ILogger<ImportService> logger)
    {
        _logger = logger;
        Directory.CreateDirectory(_imagePath);
        Directory.CreateDirectory(_textPath);

        _handlers = new Dictionary<string, Func<Stream, string, Task>>(StringComparer.OrdinalIgnoreCase)
        {
            [".jpg"] = ProcessImageAsync,
            [".png"] = ProcessImageAsync,
            [".gif"] = ProcessImageAsync,
            [".txt"] = ProcessTextFileAsync
        };
    }

    public async Task ImportFileAsync(Stream fileStream, string fileName)
    {
        try
        {
            var extension = Path.GetExtension(fileName); 
            var handler = _handlers[extension];
            
            await handler(fileStream, fileName);
        }
        catch (KeyNotFoundException)
        {
            _logger.LogWarning("Invalid file type: {FileName}", fileName);
            throw new InvalidOperationException("Invalid file type");
        }
    }
    
    private async Task ProcessImageAsync(Stream fileStream, string fileName)
    {
        using var image = await Image.LoadAsync(fileStream);

        if (image.Width > 320 || image.Height > 240)
        {
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(320, 240),
                Mode = ResizeMode.Max
            }));
        }

        var savePath = Path.Combine(_imagePath, fileName);
        await image.SaveAsync(savePath);

        _logger.LogInformation("Image loaded: {FileName}", savePath);
    }

    private async Task ProcessTextFileAsync(Stream fileStream, string fileName)
    {
        if (fileStream.Length > 102_400) 
        {
            _logger.LogWarning("Text file to large: {FileName}", fileName);
            throw new InvalidOperationException("The file exceeds the allowed size");
        }

        using var reader = new StreamReader(fileStream, Encoding.GetEncoding(1251));
        var content = await reader.ReadToEndAsync();
        content = SanitizeText(content);

        var savePath = Path.Combine(_textPath, fileName);
        await File.WriteAllTextAsync(savePath, content);

        _logger.LogInformation("Text file loaded: {FileName}", savePath);
    }

    private string SanitizeText(string input)
    {
        string pattern = @"</?(?!a\b|i\b|strong\b|code\b)[^>]*>";
        return Regex.Replace(input, pattern, string.Empty);
    }
}
using Microsoft.Extensions.Caching.Memory;
using SPA.Application.Interfaces.Service;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.Fonts;
using SPA.Application.DTO.Captcha;

namespace SPA.Infrastructure.Services;

public class CaptchaService : ICaptchaService
{
    private readonly IMemoryCache _cache;
    private readonly Random _random;

    public CaptchaService(IMemoryCache cache)
    {
        _cache = cache;
        _random = new Random();
    }

    public async Task<CaptchaDto> GenerateCaptchaAsync()
    {
        var sessionId = Guid.NewGuid().ToString();
        var captchaText = GenerateRandomText();
        
        _cache.Set(sessionId, captchaText, TimeSpan.FromMinutes(5));
        
        var imageBase64 = await GenerateCaptchaImageAsync(captchaText);
        
        return new CaptchaDto
        {
            ImageBase64 = imageBase64,
            SessionId = sessionId
        };
    }

    public async Task<bool> ValidateCaptchaAsync(CaptchaValidationDto dto)
    {
        if (_cache.TryGetValue(dto.SessionId, out string? correctAnswer))
        {
            var isValid = string.Equals(dto.Input, correctAnswer, StringComparison.OrdinalIgnoreCase);
        
            if (isValid)
            {
                _cache.Remove(dto.SessionId); 
            }
        
            return isValid;
        }
        
        return false;
    }

    private string GenerateRandomText()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Repeat(chars, 6)
            .Select(s => s[_random.Next(s.Length)]).ToArray());
    }

    private async Task<string> GenerateCaptchaImageAsync(string text)
    {
        using var image = new Image<Rgba32>(150, 50);
        
        image.Mutate(ctx =>
        {
            ctx.Fill(Color.White);
            AddNoiseAndText(ctx, text); 
        });
        
        using var ms = new MemoryStream();
        await image.SaveAsync(ms, new SixLabors.ImageSharp.Formats.Png.PngEncoder());
        var imageBytes = ms.ToArray();
        
        return Convert.ToBase64String(imageBytes);
    }

    private void AddNoiseAndText(IImageProcessingContext context, string text)
    {
        var random = new Random();
        
        for (int i = 0; i < 50; i++)
        {
            var z = random.Next(150);
            var y = random.Next(50);
            context.Fill(Color.LightGray, new RectangleF(z, y, 1, 1));
        }
        
        var fontFamily = SystemFonts.Collection.Families.First();
        var font = fontFamily.CreateFont(18, FontStyle.Bold);
        
        var x = 10f;
        foreach (char c in text)
        {
            var y = 10f + random.Next(-3, 4);
            var color = Color.FromRgb(
                (byte)random.Next(50, 100),
                (byte)random.Next(50, 100),
                (byte)random.Next(150, 200)
            );
            
            context.DrawText(
                c.ToString(),
                font,
                color,
                new PointF(x, y)
            );
            
            x += 20f + random.Next(-2, 3);
        }
    }
}
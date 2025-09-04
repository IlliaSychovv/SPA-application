namespace SPA.Application.Interfaces.Service;

public interface IHtmlSanitizer
{
    string SanitizeHtml(string input);
    bool IsValidHtml(string input);
}
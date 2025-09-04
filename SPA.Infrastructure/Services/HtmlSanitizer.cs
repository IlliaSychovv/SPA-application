using System.Text.RegularExpressions;
using SPA.Application.Interfaces.Service;

namespace SPA.Infrastructure.Services;

public class HtmlSanitizer : IHtmlSanitizer
{
    private readonly string[] _allowedTags = { "i", "strong", "code", "a" };
    private readonly string[] _allowedAttributes = { "href", "title" };
    
    public string SanitizeHtml(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        var dangerousTags = new[] { "script", "iframe", "object", "embed", "form", "input", "button", "select", "textarea" };
        
        foreach (var tag in dangerousTags)
        {
            input = Regex.Replace(input, $@"<{tag}[^>]*>.*?</{tag}>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);
            input = Regex.Replace(input, $@"<{tag}[^>]*/?>", "", RegexOptions.IgnoreCase);
        }
        
        input = Regex.Replace(input, @"on\w+\s*=", "", RegexOptions.IgnoreCase);
        input = Regex.Replace(input, @"javascript:", "", RegexOptions.IgnoreCase);
        input = Regex.Replace(input, @"data:", "", RegexOptions.IgnoreCase);
        
        input = RemoveUnsafeAttributes(input);
        
        return input;
    }
    
    public bool IsValidHtml(string input)
    {
        if (string.IsNullOrEmpty(input))
            return true;
            
        var dangerousPatterns = new[] 
        { 
            @"<script", @"<iframe", @"<object", @"<embed", @"<form",
            @"on\w+\s*=", @"javascript:", @"data:"
        };
        
        if (dangerousPatterns.Any(pattern => Regex.IsMatch(input, pattern, RegexOptions.IgnoreCase)))
            return false;
            
        return AreAllTagsClosed(input);
    }
    
    private string RemoveUnsafeAttributes(string input)
    {
        foreach (var tag in _allowedTags)
        {
            var pattern = $@"<{tag}([^>]*)>";
            input = Regex.Replace(input, pattern, match =>
            {
                var attributes = match.Groups[1].Value;
                var safeAttributes = ExtractSafeAttributes(attributes);
                return $"<{tag}{safeAttributes}>";
            }, RegexOptions.IgnoreCase);
        }
        
        return input;
    }
    
    private string ExtractSafeAttributes(string attributes)
    {
        var safeAttributes = new List<string>();
        
        foreach (var attr in _allowedAttributes)
        {
            var pattern = $@"{attr}\s*=\s*""([^""]*)""";
            var match = Regex.Match(attributes, pattern, RegexOptions.IgnoreCase);
            if (match.Success)
            {
                var value = match.Groups[1].Value;
                if (!value.Contains("javascript:") && !value.Contains("data:"))
                {
                    safeAttributes.Add($"{attr}=\"{value}\"");
                }
            }
        }
        
        return safeAttributes.Count > 0 ? " " + string.Join(" ", safeAttributes) : "";
    }
    
    private bool AreAllTagsClosed(string input)
    {
        var openTags = new Stack<string>();
        var tagPattern = @"<(/?)([a-zA-Z]+)([^>]*)>";
        
        var matches = Regex.Matches(input, tagPattern);
        
        foreach (Match match in matches)
        {
            var isClosing = match.Groups[1].Value == "/";
            var tagName = match.Groups[2].Value.ToLower();
            var attributes = match.Groups[3].Value;
            
            var isSelfClosing = attributes.Trim().EndsWith("/");
            
            if (isSelfClosing)
                continue;
            
            if (isClosing)
            {
                if (openTags.Count == 0 || openTags.Pop() != tagName)
                    return false;
            }
            else
            {
                if (!_allowedTags.Contains(tagName))
                    return false;
                openTags.Push(tagName);
            }
        }
        
        return openTags.Count == 0;
    }
}
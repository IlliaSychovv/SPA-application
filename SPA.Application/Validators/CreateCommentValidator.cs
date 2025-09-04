using FluentValidation;
using SPA.Application.DTO.Comments;
using SPA.Application.Interfaces.Service;

namespace SPA.Application.Validators;

public class CreateCommentValidator : AbstractValidator<CreateCommentDto>
{
    public CreateCommentValidator(IHtmlSanitizer htmlSanitizer)
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(30).WithMessage("Name must not exceed 30 characters")
            .Matches(@"^[a-zA-Z0-9\s]+$").WithMessage("Name must contain only Latin letters, numbers and spaces");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email is required");
        
        RuleFor(x => x.HomePage)
            .Cascade(CascadeMode.Stop)
            .Must(uri => string.IsNullOrEmpty(uri) || Uri.IsWellFormedUriString(uri, UriKind.Absolute))
            .WithMessage("HomePage must be a valid URL or empty");
        
        RuleFor(x => x.Text)
            .NotEmpty().WithMessage("Text is required")
            .Length(1, 2000).WithMessage("Text must be between 1 and 2000 characters")
            .Must(htmlSanitizer.IsValidHtml)
            .WithMessage("Text contains invalid or have dangerous HTML");
            
        RuleFor(x => x.Captcha)
            .NotEmpty().WithMessage("CAPTCHA is required");
            
        RuleFor(x => x.CaptchaSessionId)
            .NotEmpty().WithMessage("CAPTCHA session is required");
    }
}
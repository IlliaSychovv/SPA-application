using FluentValidation;
using SPA.Application.DTO.Comments;

namespace SPA.Application.Validators;

public class CommentReplyValidator : AbstractValidator<CommentReplyWithFilesDto>
{
    public CommentReplyValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required");
        
        RuleFor(x => x.Text)
            .NotEmpty().WithMessage("Text is required")
            .MaximumLength(2000).WithMessage("Text must not exceed 2000 characters");
    }
}
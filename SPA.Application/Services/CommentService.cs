using Mapster;
using SPA.Application.DTO;
using SPA.Application.DTO.Comments;
using SPA.Application.DTO.Files;
using SPA.Application.Interfaces.Repository;
using SPA.Application.Interfaces.Service;
using SPA.Domain.Entities;

namespace SPA.Application.Services;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _commentRepository;
    private readonly IAuthRepository _authRepository;
    private readonly IFileProcessingService _fileProcessingService;

    public CommentService(ICommentRepository repository, IAuthRepository authRepository, IFileProcessingService fileProcessingService)
    {
        _commentRepository = repository;
        _authRepository = authRepository;
        _fileProcessingService = fileProcessingService;
    }

    public async Task<CommentDto> CreateComment(CreateCommentDto dto)
    {
        var user = await _authRepository.GetByEmailAsync(dto.Email);
        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Email = dto.Email,
                Homepage = dto.HomePage
            };
            await _authRepository.RegisterUserAsync(user);
        }
        
        var comment = dto.Adapt<Comment>();
        comment.Id = Guid.NewGuid();
        comment.User = user;
        comment.UserId = user.Id;
        comment.Created = DateTime.Now;
        
        await _commentRepository.AddAsync(comment);
        return MapToCommentDto(comment);
    }
    
    public async Task<PagedResponse<CommentDto>> GetAll(int pageNumber, int pageSize, string? sortBy = null,
         bool isDescending = true, string? filterByName = null, DateTime? filterByDate = null)
    {
        var comments = await _commentRepository.GetAllWithRepliesAsync(pageNumber, pageSize, sortBy, isDescending, filterByName, filterByDate);
        var totalCount = await _commentRepository.GetCountAsync(filterByName, filterByDate);

        var commentDto = comments.Select(MapToCommentDto).ToList();
    
        return new PagedResponse<CommentDto>
        {
            Items = commentDto,
            TotalCount = totalCount,
            PageSize = pageSize,
            CurrentPage = pageNumber
        };
    }

    public async Task<CommentDto> AddReply(Guid parentId, CommentReplyDto dto, List<FileStreamData>? files = null)
    {
        var user = await _authRepository.GetByUserNameAsync(dto.Name);
        
        var reply = dto.Adapt<Comment>();
        reply.Id = Guid.NewGuid();
        reply.User = user;
        reply.UserId = user.Id;
        reply.ParentId = parentId;
        reply.Created = DateTime.Now;
        
        await _commentRepository.AddAsync(reply);
        
        if (files != null && files.Any())
        {
            foreach (var fileData in files)
            { 
                await _fileProcessingService.ProcessAndSaveFileAsync(fileData, reply.Id);
            }
        }

        return MapToCommentDto(reply); 
    }
    
    private CommentDto MapToCommentDto(Comment comment)
    {
        return new CommentDto
        {
            Id = comment.Id,
            Text = comment.Text,
            UserId = comment.UserId,
            Name = comment.User.Name,
            Created = comment.Created,
            ParentId = comment.ParentId,
            Replies = comment.Replies.Select(MapToCommentDto).ToList(),
            Files = comment.Files.Select(f => new FileDto
            {
                Id = f.Id,
                FileName = Path.GetFileName(f.Path),
                Path = f.Path,
                Type = f.Type.ToString(),
                Size = f.Size,
                SizeFormatted = FormatFileSize(f.Size)
            }).ToList()
        };
    }
    
    private string FormatFileSize(long bytes)
    {
        string[] sizes = { "B", "KB", "MB", "GB" };
        double len = bytes;
        int order = 0;
        while (len >= 1024 && order < sizes.Length - 1)
        {
            order++;
            len = len / 1024;
        }
        return $"{len:0.##} {sizes[order]}";
    }
}
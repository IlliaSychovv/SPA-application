using Mapster;
using SPA.Application.DTO.Comments;
using SPA.Application.Interfaces.Repository;
using SPA.Application.Interfaces.Service;
using SPA.Domain.Entities;

namespace SPA.Application.Services;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _commentRepository;
    private readonly IAuthRepository _authRepository;

    public CommentService(ICommentRepository repository, IAuthRepository authRepository)
    {
        _commentRepository = repository;
        _authRepository = authRepository;
    }

    public async Task<CommentDto> CreateComment(CreateCommentDto dto)
    {
        var user = await _authRepository.GetByIdAsync(dto.UserId);
        
        var comment = dto.Adapt<Comment>();
        comment.Id = Guid.NewGuid();
        comment.User = user;
        comment.UserId = user.Id;
        
        await _commentRepository.AddAsync(comment);
        return dto.Adapt<CommentDto>();
    }
    
    public async Task<CommentTreeDto> GetAll(int pageNumber, int pageSize, string? sortBy = null,
        bool isDescending = true, string? filterByName = null, DateTime? filterByDate = null)
    {
        var comments = await _commentRepository.GetAllWithRepliesAsync(pageNumber, pageSize, sortBy, isDescending, filterByName, filterByDate);
        var totalCount = await _commentRepository.GetCountAsync(filterByName, filterByDate);

        var commentTree = comments.Select(MapToCommentDto).ToList();
    
        return new CommentTreeDto
        {
            RootComments = commentTree,
            TotalCount = totalCount,
            PageSize = pageSize,
            CurrentPage = pageNumber,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
            HasNextPage = pageNumber < (int)Math.Ceiling((double)totalCount / pageSize)
        };
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
            Replies = comment.Replies.Select(MapToCommentDto).ToList()
        };
    }

    public async Task<CommentDto> AddReply(Guid parentId, CommentReplyDto dto)
    {
        var reply = dto.Adapt<Comment>();
        reply.Id = Guid.NewGuid();
        reply.UserId = dto.UserId;
        reply.ParentId = parentId;
        
        await _commentRepository.AddAsync(reply);
        
        return reply.Adapt<CommentDto>();
    }
}
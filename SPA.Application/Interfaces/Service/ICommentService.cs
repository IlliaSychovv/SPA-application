using SPA.Application.DTO;
using SPA.Application.DTO.Comments;
using SPA.Application.DTO.Files;

namespace SPA.Application.Interfaces.Service;

public interface ICommentService
{
    Task<CommentDto> CreateComment(CreateCommentDto dto); 
    Task<PagedResponse<CommentDto>> GetAll(int pageNumber, int pageSize, string? sortBy = null,
        bool isDescending = true, string? filterByName = null, DateTime? filterByDate = null); 
    Task<CommentDto> AddReply(Guid parentId, CommentReplyDto dto, List<FileStreamData> files = null);
}
using SPA.Domain.Entities;

namespace SPA.Application.Interfaces.Repository;

public interface ICommentRepository
{
    Task AddAsync(Comment comment); 
    Task<IReadOnlyList<Comment>> GetAllWithRepliesAsync(int pageNumber, int pageSize, string? sortBy = null,
        bool isDescending = true, string? filterByUserName = null, DateTime? filterByDate = null);
    Task AddReplyAsync(Guid parentId, Comment reply);
    Task<int> GetCountAsync(string? filterByName = null, DateTime? filterByDate = null);
}
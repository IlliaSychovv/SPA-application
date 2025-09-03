using Microsoft.EntityFrameworkCore;
using SPA.Application.Interfaces.Repository;
using SPA.Domain.Entities;
using SPA.Infrastructure.Data;

namespace SPA.Infrastructure.Repositories;

public class CommentRepository : ICommentRepository
{
    private readonly AppDbContext _context;

    public CommentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Comment comment)
    {
        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();
    }
    
    public async Task<IReadOnlyList<Comment>> GetAllWithRepliesAsync(int pageNumber, int pageSize, string? sortBy = null, 
        bool isDescending = true, string? filterByUserName = null, DateTime? filterByDate = null)
    {
        IQueryable<Comment> query = _context.Comments
            .Include(x => x.User)
            .Include(x => x.Files)
            .Include(x => x.Replies)
                .ThenInclude(r => r.User)
            .Include(x => x.Replies)
                .ThenInclude(r => r.Files)
            .Include(x => x.Replies)
                .ThenInclude(r => r.Replies) 
                .ThenInclude(rr => rr.User)
            .Include(x => x.Replies)
                .ThenInclude(r => r.Replies)
                .ThenInclude(rr => rr.Files)
            .Where(c => c.ParentId == null);

        if(!string.IsNullOrWhiteSpace(filterByUserName))
            query = query.Where(q => q.User.Name == filterByUserName);
    
        if(filterByDate.HasValue)
            query = query.Where(q => q.Created.Date == filterByDate.Value);
    
        query = sortBy switch
        {
            "Name" => isDescending ? query.OrderByDescending(c => c.User.Name) : query.OrderBy(c => c.User.Name),
            "Email" => isDescending ? query.OrderByDescending(c => c.User.Email) : query.OrderBy(c => c.User.Email),
            "Created" => isDescending ? query.OrderByDescending(c => c.Created) : query.OrderBy(c => c.Created),
            _ => query.OrderByDescending(c => c.Created)
        };
    
        var result = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
            
        return result;
    }

    public async Task<int> GetCountAsync(string? filterByName = null, DateTime? filterByDate = null)
    {
        IQueryable<Comment> query = _context.Comments.Where(c => c.ParentId == null);
        
        if(!string.IsNullOrWhiteSpace(filterByName))
            query = query.Where(q => q.User.Name == filterByName);
        
        if(filterByDate.HasValue)
            query = query.Where(q => q.Created.Date == filterByDate.Value); 
        
        return await query.CountAsync();
    }

    public async Task AddReplyAsync(Guid parentId, Comment reply)
    {
        reply.ParentId = parentId;
        
        await _context.Comments.AddAsync(reply);
        await _context.SaveChangesAsync();
    }
}
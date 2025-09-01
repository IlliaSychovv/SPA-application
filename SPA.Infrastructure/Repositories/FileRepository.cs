using Microsoft.EntityFrameworkCore;
using SPA.Application.Interfaces.Repository;
using SPA.Infrastructure.Data;
using File = SPA.Domain.Entities.File;

namespace SPA.Infrastructure.Repositories;

public class FileRepository : IFileRepository
{
    private readonly AppDbContext _context;

    public FileRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<File> AddFileAsync(File file)
    {
        await _context.Files.AddAsync(file);
        await _context.SaveChangesAsync();
        return file;
    }

    public async Task<List<File>> GetFileByIdAsync(Guid commentId)
    {
        return await _context.Files
            .Where(f => f.CommentId == commentId)
            .ToListAsync();
    }
}
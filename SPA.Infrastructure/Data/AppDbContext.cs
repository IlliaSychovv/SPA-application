using Microsoft.EntityFrameworkCore;
using SPA.Domain.Entities;
using File = SPA.Domain.Entities.File;

namespace SPA.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(c => c.Id);
            
            entity.Property(c => c.Created)
                .HasDefaultValueSql("getutcdate()");

            entity.HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(c => c.Parent)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict);  

            entity.HasMany(c => c.Files)
                .WithOne(f => f.Comment)
                .HasForeignKey(f => f.CommentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<File>(entity =>
        {
            entity.HasKey(f => f.Id);

            entity.Property(f => f.Type)
                .HasConversion<string>(); 
        });
        
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
        });
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<File> Files { get; set; }
}
namespace SPA.Application.DTO.Comments;

public record CommentDto
{ 
   public Guid Id { get; set; }
   public string Text { get; set; } = string.Empty;
   public Guid UserId { get; set; }
   public string Name { get; set; } = string.Empty;
   public DateTime Created { get; set; }
   public Guid? ParentId { get; set; }   
   public List<CommentDto> Replies { get; set; } = new List<CommentDto>();
}
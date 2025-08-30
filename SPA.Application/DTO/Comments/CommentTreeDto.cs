namespace SPA.Application.DTO.Comments;

public record CommentTreeDto
{
    public List<CommentDto> RootComments { get; set; } = new List<CommentDto>();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
}
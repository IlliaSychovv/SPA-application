namespace SPA.Application.DTO;

public record PagedResponse<T>
{
    public List<T> Items { get; set; }
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int PageNumber { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => CurrentPage < TotalPages;
}
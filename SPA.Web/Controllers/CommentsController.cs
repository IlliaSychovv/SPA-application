using Microsoft.AspNetCore.Mvc;
using SPA.Application.DTO;
using SPA.Application.DTO.Comments;
using SPA.Application.DTO.Files;
using SPA.Application.Interfaces.Service;

namespace SPAApp.Controllers;

[ApiController]
[Route("api/v1/comments")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpPost]
    public async Task<ActionResult<CommentDto>> CreateComment([FromBody] CreateCommentDto dto)
    {
        await _commentService.CreateComment(dto);
        return Created(string.Empty, dto);
    }
    
    [HttpGet]
    public async Task<ActionResult<PagedResponse<CommentTreeDto>>> GetComments(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 25,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool isDescending = true,
        [FromQuery] string? filterByName = null,
        [FromQuery] DateTime? filterByDate = null)
    {
        var paged = await _commentService.GetAll(pageNumber, pageSize, sortBy, isDescending, filterByName, filterByDate);
        return Ok(paged);
    }

    [HttpPost("{parentId}/replies")]
    public async Task<ActionResult<CommentDto>> AddReply(Guid parentId, [FromForm] CommentReplyWithFilesDto dto)
    {
        var commentDto = new CommentReplyDto
        {
            Text = dto.Text,
            UserId = dto.UserId,
            Name = dto.Name,
            Created = dto.Created
        };

        var fileStreams = dto.Files?.Select(file => new FileStreamData
        {
            Stream = file.OpenReadStream(),
            FileName = file.FileName,
            Size = file.Length
        }).ToList();

        var reply = await _commentService.AddReply(parentId, commentDto, fileStreams);
        return Created(string.Empty, reply);
    }
}
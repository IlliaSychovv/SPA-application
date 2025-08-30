using Microsoft.AspNetCore.Mvc;
using SPA.Application.DTO;
using SPA.Application.DTO.Comments;
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
    public async Task<ActionResult<PagedResponse<CommentTreeDto>>> GetComments([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 25)
    {
        var paged = await _commentService.GetAll(pageNumber, pageSize);
        return Ok(paged);
    }

    [HttpPost("{parentId}/replies")]
    public async Task<ActionResult<CommentDto>> AddReply(Guid parentId, [FromBody] CommentReplyDto dto)
    {
        var reply = await _commentService.AddReply(parentId, dto);
        return Created(string.Empty, dto);
    }
}
using Mapster;
using Microsoft.AspNetCore.Mvc;
using SPA.Application.DTO;
using SPA.Application.DTO.Captcha;
using SPA.Application.DTO.Comments;
using SPA.Application.DTO.Files;
using SPA.Application.Interfaces.Service;

namespace SPAApp.Controllers;

[ApiController]
[Route("api/v1/comments")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;
    private readonly ICaptchaService _captchaService;

    public CommentsController(ICommentService commentService, ICaptchaService captchaService)
    {
        _commentService = commentService;
        _captchaService = captchaService;
    }

    [HttpPost]
    public async Task<ActionResult<CommentDto>> CreateComment([FromBody] CreateCommentDto dto)
    {
        var captchaValidation = new CaptchaValidationDto
        {
            Input = dto.Captcha,
            SessionId = dto.CaptchaSessionId
        };
        
        if(!await _captchaService.ValidateCaptchaAsync(captchaValidation))
            return BadRequest("Invalid captcha");
        
        var comment =  await _commentService.CreateComment(dto);
        return Created(string.Empty, comment);
    }
    
    [HttpGet]
    public async Task<ActionResult<PagedResponse<CommentDto>>> GetComments(
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
        var fileStreams = dto.Files?.Select(file => new FileStreamData
        {
            Stream = file.OpenReadStream(),
            FileName = file.FileName,
            Size = file.Length
        }).ToList();

        var reply = await _commentService.AddReply(parentId, dto.Adapt<CommentReplyDto>(), fileStreams);
        return Created(string.Empty, reply);
    }
}
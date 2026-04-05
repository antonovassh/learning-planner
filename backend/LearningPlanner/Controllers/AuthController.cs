using LearningPlanner.Api.DTOs;
using LearningPlanner.Application.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace LearningPlanner.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken ct)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest("Email and password are required");

            var result = await _authService.RegisterAsync(request.Email, request.Password, ct);

            if (!result.Success)
                return BadRequest(new AuthResponse { Success = false, Message = result.Message });

            return Ok(new AuthResponse
            {
                Success = true,
                Message = result.Message,
                UserId = result.UserId
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request, CancellationToken ct)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest("Email and password are required");

            var result = await _authService.LoginAsync(request.Email, request.Password, ct);

            if (!result.Success)
                return Unauthorized(new AuthResponse { Success = false, Message = result.Message });

            return Ok(new AuthResponse
            {
                Success = true,
                AccessToken = result.AccessToken,
                RefreshToken = result.RefreshToken,
                UserId = result.UserId
            });
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] RefreshTokenRequest request, CancellationToken ct)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.RefreshToken))
                return BadRequest("Refresh token is required");

            var result = await _authService.RefreshTokenAsync(request.RefreshToken, ct);

            if (!result.Success)
                return Unauthorized(new AuthResponse { Success = false, Message = result.Message });

            return Ok(new AuthResponse
            {
                Success = true,
                AccessToken = result.AccessToken,
                RefreshToken = result.RefreshToken,
                UserId = result.UserId
            });
        }
    }
}

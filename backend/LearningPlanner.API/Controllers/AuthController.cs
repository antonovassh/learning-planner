using LearningPlanner.Api.DTOs;
using LearningPlanner.Application.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LearningPlanner.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private const string RefreshTokenCookieName = "RefreshToken";
        private const int RefreshTokenExpiryDays = 7;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest request, CancellationToken ct)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new RegisterResponse
                {
                    Success = false,
                    Message = "Email and password are required"
                });

            var result = await _authService.RegisterAsync(request.Email, request.Password, ct);

            if (!result.Success)
                return BadRequest(new RegisterResponse
                {
                    Success = false,
                    Message = result.Message
                });

            return Ok(new RegisterResponse
            {
                Success = true,
                Message = "User registered successfully",
                UserId = result.UserId,
                Email = result.Email
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request, CancellationToken ct)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = "Email and password are required"
                });

            var result = await _authService.LoginAsync(request.Email, request.Password, ct);

            if (!result.Success)
                return Unauthorized(new AuthResponse
                {
                    Success = false,
                    Message = result.Message
                });

            SetRefreshTokenCookie(result.RefreshToken!);

            return Ok(new AuthResponse
            {
                Success = true,
                AccessToken = result.AccessToken,
                UserId = result.UserId,
                Email = result.Email
            });
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponse>> RefreshToken(CancellationToken ct)
        {
            if (!Request.Cookies.TryGetValue(RefreshTokenCookieName, out var refreshToken) ||
                string.IsNullOrWhiteSpace(refreshToken))
            {
                return Unauthorized(new AuthResponse
                {
                    Success = false,
                    Message = "Refresh token is missing"
                });
            }

            var result = await _authService.RefreshTokenAsync(refreshToken, ct);

            if (!result.Success)
                return Unauthorized(new AuthResponse
                {
                    Success = false,
                    Message = result.Message
                });

            SetRefreshTokenCookie(result.RefreshToken!);

            return Ok(new AuthResponse
            {
                Success = true,
                AccessToken = result.AccessToken,
                UserId = result.UserId,
                Email = result.Email
            });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult<LogoutResponse>> Logout(CancellationToken ct)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new LogoutResponse
                {
                    Success = false,
                    Message = "Invalid user context"
                });
            }

            if (!Request.Cookies.TryGetValue(RefreshTokenCookieName, out var refreshToken) ||
                string.IsNullOrWhiteSpace(refreshToken))
            {
                return BadRequest(new LogoutResponse
                {
                    Success = false,
                    Message = "Refresh token is missing"
                });
            }

            var result = await _authService.LogoutAsync(userId, refreshToken, ct);

            if (!result.Success)
                return BadRequest(new LogoutResponse
                {
                    Success = false,
                    Message = result.Message
                });

            RemoveRefreshTokenCookie();

            return Ok(new LogoutResponse
            {
                Success = true,
                Message = "Logged out successfully"
            });
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(RefreshTokenExpiryDays)
            };

            Response.Cookies.Append(RefreshTokenCookieName, refreshToken, cookieOptions);
        }

        private void RemoveRefreshTokenCookie()
        {
            Response.Cookies.Delete(RefreshTokenCookieName, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            });
        }
    }
}

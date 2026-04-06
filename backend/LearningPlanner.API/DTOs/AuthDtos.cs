namespace LearningPlanner.Api.DTOs
{
    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RefreshTokenRequest
    {
    }

    public class AuthResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public string? AccessToken { get; set; }
        public Guid? UserId { get; set; }
        public string? Email { get; set; }
    }

    public class RegisterResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public Guid? UserId { get; set; }
        public string? Email { get; set; }
    }

    public class LogoutRequest
    {
    }

    public class LogoutResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
    }
}

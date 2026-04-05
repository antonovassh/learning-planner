namespace LearningPlanner.Application.Abstractions
{
    public interface IAuthService
    {
        Task<AuthResult> RegisterAsync(string email, string password, CancellationToken cancellationToken);
        Task<AuthResult> LoginAsync(string email, string password, CancellationToken cancellationToken);
        Task<AuthResult> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken);
    }

    public class AuthResult
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public Guid? UserId { get; set; }
    }
}

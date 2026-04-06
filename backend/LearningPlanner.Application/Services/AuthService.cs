using LearningPlanner.Application.Abstractions;
using LearningPlanner.Domain.Models;

namespace LearningPlanner.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ITokenProvider _tokenProvider;

        public AuthService(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            ITokenProvider tokenProvider)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _tokenProvider = tokenProvider;
        }

        public async Task<AuthResult> RegisterAsync(string email, string password, CancellationToken cancellationToken)
        {
            var existingUser = await _userRepository.GetByEmailAsync(email, cancellationToken);
            if (existingUser != null)
            {
                return new AuthResult
                {
                    Success = false,
                    Message = "User with this email already exists"
                };
            }

            if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
            {
                return new AuthResult
                {
                    Success = false,
                    Message = "Password must be at least 6 characters long"
                };
            }

            var passwordHash = _passwordHasher.HashPassword(password);
            var user = new User(email, passwordHash);

            await _userRepository.AddAsync(user, cancellationToken);
            await _userRepository.SaveChangesAsync(cancellationToken);

            return new AuthResult
            {
                Success = true,
                Message = "User registered successfully",
                UserId = user.Id,
                Email = user.Email
            };
        }

        public async Task<AuthResult> LoginAsync(string email, string password, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByEmailAsync(email, cancellationToken);
            if (user == null)
            {
                return new AuthResult
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            if (!_passwordHasher.VerifyPassword(password, user.PasswordHash))
            {
                return new AuthResult
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            await RevokeAllUserRefreshTokensAsync(user.Id, cancellationToken);

            var accessToken = _tokenProvider.GenerateJwtToken(user.Id, user.Email);
            var refreshToken = _tokenProvider.GenerateRefreshToken();

            var refreshTokenEntity = new RefreshToken(user.Id, refreshToken, DateTime.UtcNow.AddDays(7));
            await _userRepository.AddRefreshTokenAsync(refreshTokenEntity, cancellationToken);
            await _userRepository.SaveChangesAsync(cancellationToken);

            return new AuthResult
            {
                Success = true,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                UserId = user.Id,
                Email = user.Email
            };
        }

        public async Task<AuthResult> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                return new AuthResult
                {
                    Success = false,
                    Message = "Refresh token is required"
                };
            }

            var user = await _userRepository.GetByRefreshTokenAsync(refreshToken, cancellationToken);
            if (user == null)
            {
                return new AuthResult
                {
                    Success = false,
                    Message = "Invalid or expired refresh token"
                };
            }

            var tokenEntity = user.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshToken);
            if (tokenEntity == null || !tokenEntity.IsValid())
            {
                return new AuthResult
                {
                    Success = false,
                    Message = "Invalid or expired refresh token"
                };
            }

            tokenEntity.Revoke();

            var newAccessToken = _tokenProvider.GenerateJwtToken(user.Id, user.Email);
            var newRefreshToken = _tokenProvider.GenerateRefreshToken();

            var newRefreshTokenEntity = new RefreshToken(user.Id, newRefreshToken, DateTime.UtcNow.AddDays(7));
            await _userRepository.AddRefreshTokenAsync(newRefreshTokenEntity, cancellationToken);
            await _userRepository.SaveChangesAsync(cancellationToken);

            return new AuthResult
            {
                Success = true,
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                UserId = user.Id,
                Email = user.Email
            };
        }

        public async Task<AuthResult> LogoutAsync(Guid userId, string refreshToken, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
            if (user == null)
            {
                return new AuthResult
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            var tokenEntity = user.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshToken);
            if (tokenEntity != null)
            {
                tokenEntity.Revoke();
                await _userRepository.SaveChangesAsync(cancellationToken);
            }

            return new AuthResult
            {
                Success = true,
                Message = "Logged out successfully"
            };
        }

        private async Task RevokeAllUserRefreshTokensAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
            if (user != null)
            {
                foreach (var token in user.RefreshTokens.Where(t => !t.IsRevoked))
                {
                    token.Revoke();
                }
                await _userRepository.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
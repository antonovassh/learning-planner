using LearningPlanner.Domain.Models;

namespace LearningPlanner.Application.Abstractions
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken);
        Task<User?> GetByRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken);
        Task AddRefreshTokenAsync(RefreshToken token, CancellationToken cancellationToken);
        Task AddAsync(User user, CancellationToken cancellationToken);
        Task SaveChangesAsync(CancellationToken cancellationToken);
    }
}

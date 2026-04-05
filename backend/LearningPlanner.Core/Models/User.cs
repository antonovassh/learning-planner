namespace LearningPlanner.Domain.Models
{
    public class User
    {
        public Guid Id { get; private set; }
        public string Email { get; private set; }
        public string PasswordHash { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        private readonly List<RefreshToken> _refreshTokens = new();
        public IReadOnlyCollection<RefreshToken> RefreshTokens => _refreshTokens;

        private readonly List<LearningGoal> _goals = new();
        public IReadOnlyCollection<LearningGoal> Goals => _goals;

        public User(string email, string passwordHash)
        {
            Id = Guid.NewGuid();
            Email = email;
            PasswordHash = passwordHash;
            CreatedAt = DateTime.UtcNow;
        }

        public User(Guid id, string email, string passwordHash, DateTime createdAt, DateTime? updatedAt)
        {
            Id = id;
            Email = email;
            PasswordHash = passwordHash;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }

        public void UpdatePassword(string passwordHash)
        {
            PasswordHash = passwordHash;
            UpdatedAt = DateTime.UtcNow;
        }

        public void AddRefreshToken(RefreshToken token)
        {
            _refreshTokens.Add(token);
        }

        public void RemoveRefreshToken(RefreshToken token)
        {
            _refreshTokens.Remove(token);
        }

        public bool HasValidRefreshToken(string token)
        {
            return _refreshTokens.Any(rt => rt.Token == token && rt.ExpiresAt > DateTime.UtcNow);
        }
    }
}

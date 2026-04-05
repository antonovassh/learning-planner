namespace LearningPlanner.Domain.Models
{
    public class RefreshToken
    {
        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }
        public string Token { get; private set; }
        public DateTime ExpiresAt { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public bool IsRevoked { get; private set; }

        public User? User { get; private set; }

        public RefreshToken(Guid userId, string token, DateTime expiresAt)
        {
            Id = Guid.NewGuid();
            UserId = userId;
            Token = token;
            ExpiresAt = expiresAt;
            CreatedAt = DateTime.UtcNow;
            IsRevoked = false;
        }

        public RefreshToken(Guid id, Guid userId, string token, DateTime expiresAt, DateTime createdAt, bool isRevoked)
        {
            Id = id;
            UserId = userId;
            Token = token;
            ExpiresAt = expiresAt;
            CreatedAt = createdAt;
            IsRevoked = isRevoked;
        }

        public void Revoke()
        {
            IsRevoked = true;
        }

        public bool IsValid()
        {
            return !IsRevoked && ExpiresAt > DateTime.UtcNow;
        }
    }
}

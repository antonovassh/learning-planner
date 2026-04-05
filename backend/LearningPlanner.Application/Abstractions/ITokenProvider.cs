namespace LearningPlanner.Application.Abstractions
{
    public interface ITokenProvider
    {
        string GenerateJwtToken(Guid userId, string email);
        string GenerateRefreshToken();
    }
}

using LearningPlanner.Domain.Models;

namespace LearningPlanner.Application.Abstractions
{
    public interface ILearningGoalRepository
    {
        Task<List<LearningGoal>> GetAllAsync(CancellationToken ct = default);
        Task<LearningGoal?> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task AddAsync(LearningGoal goal, CancellationToken ct = default);
        Task UpdateAsync(LearningGoal goal, CancellationToken ct = default);
        Task DeleteAsync(Guid id, CancellationToken ct = default);
        Task SoftDeleteAsync(Guid id, CancellationToken ct = default);

        Task SaveChangesAsync(CancellationToken ct = default);
    }
}

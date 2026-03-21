using LearningPlanner.Core.Models;

namespace LearningPlanner.Application.Abstractions
{
    public interface ILearningTaskRepository
    {
        Task<List<LearningTask>> GetAllAsync(CancellationToken ct = default);
        Task<LearningTask?> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<List<LearningTask>> GetByGoalIdAsync(Guid goalId, CancellationToken ct = default);
        Task<int> GetCompletedTaskCountByGoalIdAsync(Guid goalId, CancellationToken ct = default);
        Task AddAsync(LearningTask task, CancellationToken ct = default);
        Task UpdateAsync(LearningTask task, CancellationToken ct = default);
        Task DeleteAsync(Guid id, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}

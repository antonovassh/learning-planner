using LearningPlanner.Application.Abstractions;

namespace LearningPlanner.Application.Services
{
    public class GoalProgressService : IGoalProgressService
    {
        private readonly ILearningGoalRepository _goalRepository;
        private readonly ILearningTaskRepository _taskRepository;

        public GoalProgressService(ILearningGoalRepository goalRepository, ILearningTaskRepository taskRepository)
        {
            _goalRepository = goalRepository;
            _taskRepository = taskRepository;
        }

        public async Task<decimal> GetGoalProgressAsync(Guid goalId, CancellationToken ct = default)
        {
            var goal = await _goalRepository.GetByIdAsync(goalId, ct);
            if (goal is null)
                throw new InvalidOperationException($"Goal with ID {goalId} not found.");

            var tasks = await _taskRepository.GetByGoalIdAsync(goalId, ct);

            if (tasks.Count == 0)
                return 0;

            var completedCount = await _taskRepository.GetCompletedTaskCountByGoalIdAsync(goalId, ct);
            return (completedCount / (decimal)tasks.Count) * 100;
        }
    }
}

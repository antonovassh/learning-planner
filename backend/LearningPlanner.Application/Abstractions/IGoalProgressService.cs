namespace LearningPlanner.Application.Abstractions
{
    public interface IGoalProgressService
    {
        /// <summary>
        /// Calculates the progress of a goal based on completed tasks.
        /// Formula: (CompletedTasksCount / TotalTasksCount) * 100
        /// </summary>
        /// <param name="goalId">The ID of the goal.</param>
        /// <param name="ct">Cancellation token.</param>
        /// <returns>Progress as a decimal percentage (0-100). Returns 0 if goal has no tasks.</returns>
        Task<decimal> GetGoalProgressAsync(Guid goalId, CancellationToken ct = default);
    }
}

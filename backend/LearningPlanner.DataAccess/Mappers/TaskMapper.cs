using LearningPlanner.Domain.Models;
using LearningPlanner.Infrastructure.Entities;
using TaskStatus = LearningPlanner.Domain.Models.TaskStatus;

namespace LearningPlanner.Infrastructure.Mappers
{
    public static class TaskMapper
    {
        public static LearningTask ToDomain(this LearningTaskEntity entity)
        {
            var status = Enum.TryParse<TaskStatus>(entity.Status, ignoreCase: true, out var parsedStatus)
                ? parsedStatus
                : TaskStatus.Todo;

            return new LearningTask(
                entity.Id,
                Guid.Empty,
                entity.GoalId,
                entity.Title,
                entity.Description,
                status,
                entity.Order,
                entity.CreatedAt
            );
        }

        public static LearningTaskEntity ToEntity(this LearningTask task)
        {
            return new LearningTaskEntity
            {
                Id = task.Id,
                GoalId = task.GoalId,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status.ToString(),
                Order = task.Order,
                CreatedAt = task.CreatedAt
            };
        }
    }
}

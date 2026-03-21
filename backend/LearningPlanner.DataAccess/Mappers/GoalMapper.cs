using LearningPlanner.Core.Models;
using LearningPlanner.DataAccess.Entities;
using TaskStatus = LearningPlanner.Core.Models.TaskStatus;

namespace LearningPlanner.DataAccess.Mappers
{
    public static class GoalMapper
    {
        public static LearningGoal ToDomain(this LearningGoalEntity entity)
        {
            var status = Enum.TryParse<GoalStatus>(entity.Status, ignoreCase: true, out var parsedStatus)
                ? parsedStatus
                : GoalStatus.Active;

            return new LearningGoal(
                entity.Id,
                entity.Title,
                entity.Description,
                status,
                entity.CreatedAt,
                entity.UpdatedAt
            );
        }

        public static LearningGoalEntity ToEntity(this LearningGoal goal)
        {
            return new LearningGoalEntity
            {
                Id = goal.Id,
                Title = goal.Title,
                Description = goal.Description,
                Status = goal.Status.ToString(),
                CreatedAt = goal.CreatedAt,
                UpdatedAt = goal.UpdatedAt
            };
        }
    }
}

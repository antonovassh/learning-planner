using LearningPlanner.Api.DTOs;
using LearningPlanner.Domain.Models;

namespace LearningPlanner.Api.Mappers
{
    public static class GoalDtoMapper
    {
        public static LearningGoalResponse ToResponse(this LearningGoal goal, decimal progress = 0)
        {
            return new LearningGoalResponse
            {
                Id = goal.Id,
                Title = goal.Title,
                Description = goal.Description,
                Status = goal.Status.ToString(),
                Progress = progress,
                CreatedAt = goal.CreatedAt,
                UpdatedAt = goal.UpdatedAt
            };
        }
    }
}

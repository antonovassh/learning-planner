using LearningPlanner.Api.DTOs;
using LearningPlanner.Domain.Models;

namespace LearningPlanner.Api.Mappers
{
    public static class TaskDtoMapper
    {
        public static LearningTaskResponse ToResponse(this LearningTask task)
        {
            return new LearningTaskResponse
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

namespace LearningPlanner.Domain.Models
{
    public class LearningTask
    {
        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }
        public Guid GoalId { get; private set; }
        public string Title { get; private set; }
        public string? Description { get; private set; }
        public TaskStatus Status { get; private set; }
        public int Order { get; private set; }
        public DateTime CreatedAt { get; private set; }

        public LearningTask(Guid userId, Guid goalId, string title, string? description = null, int order = 0)
        {
            Id = Guid.NewGuid();
            UserId = userId;
            GoalId = goalId;
            Title = title;
            Description = description;
            Status = TaskStatus.Todo;
            Order = order;
            CreatedAt = DateTime.UtcNow;
        }

        public LearningTask(Guid id, Guid userId, Guid goalId, string title, string? description, TaskStatus status, int order, DateTime createdAt)
        {
            Id = id;
            UserId = userId;
            GoalId = goalId;
            Title = title;
            Description = description;
            Status = status;
            Order = order;
            CreatedAt = createdAt;
        }

        public void UpdateTitle(string title)
        {
            Title = title;
        }

        public void UpdateDescription(string? description)
        {
            Description = description;
        }

        public void UpdateOrder(int order)
        {
            Order = order;
        }

        public void ChangeStatus(TaskStatus status)
        {
            Status = status;
        }

        public void StartProgress() => Status = TaskStatus.InProgress;
        public void Complete() => Status = TaskStatus.Done;
    }
}

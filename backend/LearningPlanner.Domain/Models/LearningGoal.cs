namespace LearningPlanner.Domain.Models
{
    public class LearningGoal
    {
        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }
        public string Title { get; private set; }
        public string? Description { get; private set; }
        public GoalStatus Status { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        private readonly List<LearningTask> _tasks = new();
        public IReadOnlyCollection<LearningTask> Tasks => _tasks;

        public LearningGoal(Guid userId, string title, string? description = null)
        {
            Id = Guid.NewGuid();
            UserId = userId;
            Title = title;
            Description = description;
            Status = GoalStatus.Active;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public LearningGoal(Guid id, Guid userId, string title, string? description, GoalStatus status, DateTime createdAt, DateTime updatedAt)
        {
            Id = id;
            UserId = userId;
            Title = title;
            Description = description;
            Status = status;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }

        public void UpdateTitle(string title)
        {
            Title = title;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateDescription(string? description)
        {
            Description = description;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateStatus(GoalStatus status)
        {
            Status = status;
            UpdatedAt = DateTime.UtcNow;
        }

        public void AddTask(LearningTask task)
        {
            _tasks.Add(task);
            UpdatedAt = DateTime.UtcNow;
        }

        public void CompleteTask(Guid taskId)
        {
            var task = _tasks.First(x => x.Id == taskId);
            task.Complete();
            UpdatedAt = DateTime.UtcNow;
        }

        public decimal CalculateProgress()
        {
            if (_tasks.Count == 0)
                return 0;

            var completedCount = _tasks.Count(t => t.Status == TaskStatus.Done);
            return (completedCount / (decimal)_tasks.Count) * 100;
        }
    }
}

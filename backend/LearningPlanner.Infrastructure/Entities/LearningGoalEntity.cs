namespace LearningPlanner.Infrastructure.Entities
{
    public class LearningGoalEntity
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Status { get; set; } = "Active";
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public List<LearningTaskEntity> Tasks { get; set; } = new();
    }
}

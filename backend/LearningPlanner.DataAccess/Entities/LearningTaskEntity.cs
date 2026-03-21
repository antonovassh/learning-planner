namespace LearningPlanner.DataAccess.Entities
{
    public class LearningTaskEntity
    {
        public Guid Id { get; set; }
        public Guid GoalId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Status { get; set; } = "Todo";
        public int Order { get; set; }
        public DateTime CreatedAt { get; set; }

        public LearningGoalEntity? Goal { get; set; }
    }
}

namespace LearningPlanner.Api.DTOs
{
    public class LearningTaskResponse
    {
        public Guid Id { get; set; }
        public Guid GoalId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Status { get; set; } = null!;
        public int Order { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

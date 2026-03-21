namespace LearningPlanner.Api.DTOs
{
    public class CreateLearningTaskRequest
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int Order { get; set; }
    }
}

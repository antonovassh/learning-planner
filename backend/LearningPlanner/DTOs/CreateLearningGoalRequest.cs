namespace LearningPlanner.Api.DTOs
{
    public class CreateLearningGoalRequest
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
    }
}

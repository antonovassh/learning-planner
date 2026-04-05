namespace LearningPlanner.Api.DTOs
{
    public class UpdateLearningTaskRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public int? Order { get; set; }
    }
}

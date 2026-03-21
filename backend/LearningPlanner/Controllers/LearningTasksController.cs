using LearningPlanner.Api.DTOs;
using LearningPlanner.Api.Mappers;
using LearningPlanner.Application.Abstractions;
using LearningPlanner.Core.Models;
using Microsoft.AspNetCore.Mvc;
using TaskStatus = LearningPlanner.Core.Models.TaskStatus;

namespace LearningPlanner.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LearningTasksController : ControllerBase
    {
        private readonly ILearningTaskRepository _taskRepository;
        private readonly ILearningGoalRepository _goalRepository;

        public LearningTasksController(ILearningTaskRepository taskRepository, ILearningGoalRepository goalRepository)
        {
            _taskRepository = taskRepository;
            _goalRepository = goalRepository;
        }

        // GET: api/LearningTasks
        [HttpGet]
        public async Task<ActionResult<List<LearningTaskResponse>>> GetAll(CancellationToken ct)
        {
            var tasks = await _taskRepository.GetAllAsync(ct);
            var response = tasks.Select(t => t.ToResponse()).ToList();
            return Ok(response);
        }

        // GET: api/LearningTasks/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<LearningTaskResponse>> GetById(Guid id, CancellationToken ct)
        {
            var task = await _taskRepository.GetByIdAsync(id, ct);
            if (task == null) return NotFound();

            var response = task.ToResponse();
            return Ok(response);
        }

        // GET: api/LearningTasks/goal/{goalId}
        [HttpGet("goal/{goalId}")]
        public async Task<ActionResult<List<LearningTaskResponse>>> GetByGoalId(Guid goalId, CancellationToken ct)
        {
            var goal = await _goalRepository.GetByIdAsync(goalId, ct);
            if (goal == null) return NotFound("Goal not found");

            var tasks = await _taskRepository.GetByGoalIdAsync(goalId, ct);
            var response = tasks.Select(t => t.ToResponse()).ToList();
            return Ok(response);
        }

        // POST: api/LearningTasks/{goalId}
        [HttpPost("{goalId}")]
        public async Task<ActionResult<LearningTaskResponse>> Create(Guid goalId, [FromBody] CreateLearningTaskRequest request, CancellationToken ct)
        {
            if (request == null) return BadRequest();

            var goal = await _goalRepository.GetByIdAsync(goalId, ct);
            if (goal == null) return NotFound("Goal not found");

            var task = new LearningTask(goalId, request.Title, request.Description, request.Order);
            await _taskRepository.AddAsync(task, ct);
            await _taskRepository.SaveChangesAsync(ct);

            var response = task.ToResponse();
            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }

        // PUT: api/LearningTasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLearningTaskRequest request, CancellationToken ct)
        {
            if (request == null) return BadRequest();

            var task = await _taskRepository.GetByIdAsync(id, ct);
            if (task == null) return NotFound();

            if (!string.IsNullOrEmpty(request.Title))
                task.UpdateTitle(request.Title);

            if (request.Description != null)
                task.UpdateDescription(request.Description);

            if (!string.IsNullOrEmpty(request.Status))
            {
                if (!Enum.TryParse<TaskStatus>(request.Status, ignoreCase: true, out var status))
                    return BadRequest($"Invalid status value: {request.Status}");

                task.ChangeStatus(status);
            }

            if (request.Order.HasValue)
                task.UpdateOrder(request.Order.Value);

            await _taskRepository.UpdateAsync(task, ct);
            await _taskRepository.SaveChangesAsync(ct);

            return NoContent();
        }

        // PATCH: api/LearningTasks/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] PatchTaskStatusRequest request, CancellationToken ct)
        {
            if (request == null || string.IsNullOrEmpty(request.Status))
                return BadRequest("Status is required");

            var task = await _taskRepository.GetByIdAsync(id, ct);
            if (task == null) return NotFound();

            if (!Enum.TryParse<TaskStatus>(request.Status, ignoreCase: true, out var status))
                return BadRequest($"Invalid status value: {request.Status}. Valid values are: Todo, InProgress, Done");

            task.ChangeStatus(status);
            await _taskRepository.UpdateAsync(task, ct);
            await _taskRepository.SaveChangesAsync(ct);

            return NoContent();
        }

        // DELETE: api/LearningTasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            var task = await _taskRepository.GetByIdAsync(id, ct);
            if (task == null) return NotFound();

            await _taskRepository.DeleteAsync(id, ct);
            await _taskRepository.SaveChangesAsync(ct);
            return NoContent();
        }
    }
}

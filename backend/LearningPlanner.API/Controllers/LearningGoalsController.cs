using LearningPlanner.Api.DTOs;
using LearningPlanner.Api.Mappers;
using LearningPlanner.Application.Abstractions;
using LearningPlanner.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningPlanner.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LearningGoalsController : ControllerBase
    {
        private readonly ILearningGoalRepository _repository;
        private readonly IGoalProgressService _progressService;

        public LearningGoalsController(ILearningGoalRepository repository, IGoalProgressService progressService)
        {
            _repository = repository;
            _progressService = progressService;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                throw new UnauthorizedAccessException("User not authenticated");
            return userId;
        }

        // GET: api/LearningGoals
        [HttpGet]
        public async Task<ActionResult<List<LearningGoalResponse>>> GetAll(CancellationToken ct)
        {
            var userId = GetUserId();
            var goals = await _repository.GetAllAsync(ct);
            var userGoals = goals.Where(g => g.UserId == userId).ToList();
            var response = new List<LearningGoalResponse>();

            foreach (var goal in userGoals)
            {
                var progress = await _progressService.GetGoalProgressAsync(goal.Id, ct);
                response.Add(goal.ToResponse(progress));
            }

            return Ok(response);
        }

        // GET: api/LearningGoals/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<LearningGoalResponse>> GetById(Guid id, CancellationToken ct)
        {
            var goal = await _repository.GetByIdAsync(id, ct);
            if (goal == null) return NotFound();

            var progress = await _progressService.GetGoalProgressAsync(id, ct);
            var response = goal.ToResponse(progress);
            return Ok(response);
        }

        // POST: api/LearningGoals
        [HttpPost]
        public async Task<ActionResult<LearningGoalResponse>> Create([FromBody] CreateLearningGoalRequest request, CancellationToken ct)
        {
            if (request == null) return BadRequest();

            var userId = GetUserId();
            var goal = new LearningGoal(userId, request.Title, request.Description);
            await _repository.AddAsync(goal, ct);
            await _repository.SaveChangesAsync(ct);

            var response = goal.ToResponse();
            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }

        // PUT: api/LearningGoals/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLearningGoalRequest request, CancellationToken ct)
        {
            if (request == null) return BadRequest();

            var goal = await _repository.GetByIdAsync(id, ct);
            if (goal == null) return NotFound();

            if (!string.IsNullOrEmpty(request.Title))
                goal.UpdateTitle(request.Title);

            if (request.Description != null)
                goal.UpdateDescription(request.Description);

            if (!string.IsNullOrEmpty(request.Status))
            {
                if (!Enum.TryParse<GoalStatus>(request.Status, ignoreCase: true, out var status))
                    return BadRequest($"Invalid status value: {request.Status}");

                goal.UpdateStatus(status);
            }

            await _repository.UpdateAsync(goal, ct);
            await _repository.SaveChangesAsync(ct);

            return NoContent();
        }

        // DELETE: api/LearningGoals/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            var goal = await _repository.GetByIdAsync(id, ct);
            if (goal == null) return NotFound();

            await _repository.DeleteAsync(id, ct);
            await _repository.SaveChangesAsync(ct);
            return NoContent();
        }

        // PATCH: api/LearningGoals/{id}/soft-delete
        [HttpPatch("{id}/soft-delete")]
        public async Task<IActionResult> SoftDelete(Guid id, CancellationToken ct)
        {
            var goal = await _repository.GetByIdAsync(id, ct);
            if (goal == null) return NotFound();

            await _repository.SoftDeleteAsync(id, ct);
            await _repository.SaveChangesAsync(ct);
            return NoContent();
        }
    }
}


using LearningPlanner.Application.Abstractions;
using LearningPlanner.Domain.Models;
using LearningPlanner.Infrastructure;
using LearningPlanner.Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;
using CoreTaskStatus = LearningPlanner.Domain.Models.TaskStatus;

namespace LearningPlanner.Infrastructure.Repository
{
    public class LearningTaskRepository : ILearningTaskRepository
    {
        private readonly AppDbContext _context;

        public LearningTaskRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(LearningTask task, CancellationToken ct = default)
        {
            var entity = task.ToEntity();
            await _context.Tasks.AddAsync(entity, ct);
        }

        public async Task DeleteAsync(Guid id, CancellationToken ct = default)
        {
            var entity = await _context.Tasks.FindAsync(new object[] { id }, ct);
            if (entity is not null)
                _context.Tasks.Remove(entity);
        }

        public async Task<List<LearningTask>> GetAllAsync(CancellationToken ct = default)
        {
            var entities = await _context.Tasks.ToListAsync(ct);
            return entities.Select(e => e.ToDomain()).ToList();
        }

        public async Task<LearningTask?> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            var entity = await _context.Tasks.FindAsync(new object[] { id }, ct);
            return entity is null ? null : entity.ToDomain();
        }

        public async Task<List<LearningTask>> GetByGoalIdAsync(Guid goalId, CancellationToken ct = default)
        {
            var entities = await _context.Tasks
                .Where(t => t.GoalId == goalId)
                .OrderBy(t => t.Order)
                .ToListAsync(ct);
            return entities.Select(e => e.ToDomain()).ToList();
        }

        public async Task<int> GetCompletedTaskCountByGoalIdAsync(Guid goalId, CancellationToken ct = default)
        {
            return await _context.Tasks
                .Where(t => t.GoalId == goalId && t.Status == CoreTaskStatus.Done.ToString())
                .CountAsync(ct);
        }

        public async Task UpdateAsync(LearningTask task, CancellationToken ct = default)
        {
            var entity = await _context.Tasks.FindAsync(new object[] { task.Id }, ct);
            if (entity is not null)
            {
                entity.Title = task.Title;
                entity.Description = task.Description;
                entity.Status = task.Status.ToString();
                entity.Order = task.Order;
            }
        }

        public async Task SaveChangesAsync(CancellationToken ct = default)
        {
            await _context.SaveChangesAsync(ct);
        }
    }
}


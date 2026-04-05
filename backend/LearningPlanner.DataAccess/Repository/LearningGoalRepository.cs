using LearningPlanner.Application.Abstractions;
using LearningPlanner.Domain.Models;
using LearningPlanner.Infrastructure.Mappers;
using Microsoft.EntityFrameworkCore;

namespace LearningPlanner.Infrastructure.Repository
{
    public class LearningGoalRepository : ILearningGoalRepository
    {
        private readonly AppDbContext _context;

        public LearningGoalRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(LearningGoal goal, CancellationToken ct = default)
        {
            var entity = goal.ToEntity();
            await _context.Goals.AddAsync(entity, ct);
        }

        public async Task DeleteAsync(Guid id, CancellationToken ct = default)
        {
            var entity = await _context.Goals.FindAsync(new object[] { id }, ct);
            if (entity is not null)
                _context.Goals.Remove(entity);
        }

        public async Task SoftDeleteAsync(Guid id, CancellationToken ct = default)
        {
            var entity = await _context.Goals.FindAsync(new object[] { id }, ct);
            if (entity is not null)
            {
                entity.Status = GoalStatus.Archived.ToString();
                entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        public async Task<List<LearningGoal>> GetAllAsync(CancellationToken ct = default)
        {
            var entities = await _context.Goals.ToListAsync(ct);
            return entities.Select(e => e.ToDomain()).ToList();
        }

        public async Task<LearningGoal?> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            var entity = await _context.Goals.FindAsync(new object[] { id }, ct);
            return entity is null ? null : entity.ToDomain();
        }

        public async Task UpdateAsync(LearningGoal goal, CancellationToken ct = default)
        {
            var entity = await _context.Goals.FindAsync(new object[] { goal.Id }, ct);
            if (entity is not null)
            {
                entity.Title = goal.Title;
                entity.Description = goal.Description;
                entity.Status = goal.Status.ToString();
                entity.UpdatedAt = goal.UpdatedAt;
            }
        }

        public async Task SaveChangesAsync(CancellationToken ct = default)
        {
            await _context.SaveChangesAsync(ct);
        }
    }
}


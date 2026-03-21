using LearningPlanner.Core.Models;
using LearningPlanner.DataAccess.Entities;
using LearningPlanner.DataAccess.Entities.Configuration;
using Microsoft.EntityFrameworkCore;

namespace LearningPlanner.DataAccess
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<LearningGoalEntity> Goals { get; set; }
        public DbSet<LearningTaskEntity> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.ApplyConfiguration(new LearningGoalConfiguration());
            modelBuilder.ApplyConfiguration(new LearningTaskConfiguration());
        }
    }

}

using LearningPlanner.Domain.Models;
using LearningPlanner.Infrastructure.Entities;
using LearningPlanner.Infrastructure.Entities.Configuration;
using Microsoft.EntityFrameworkCore;

namespace LearningPlanner.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<LearningGoalEntity> Goals { get; set; }
        public DbSet<LearningTaskEntity> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new LearningGoalConfiguration());
            modelBuilder.ApplyConfiguration(new LearningTaskConfiguration());

            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<RefreshToken>()
                .HasKey(rt => rt.Id);
            modelBuilder.Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

}

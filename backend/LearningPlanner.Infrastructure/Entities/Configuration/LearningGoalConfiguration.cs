using LearningPlanner.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningPlanner.Infrastructure.Entities.Configuration
{
    public class LearningGoalConfiguration : IEntityTypeConfiguration<LearningGoalEntity>
    {
        public void Configure(EntityTypeBuilder<LearningGoalEntity> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(b => b.Title).IsRequired();
            builder.Property(b => b.Description).IsRequired(false);
            builder.Property(b => b.Status).IsRequired();
            builder.Property(b => b.CreatedAt).IsRequired();
            builder.Property(b => b.UpdatedAt).IsRequired();

            builder.HasMany(g => g.Tasks)
                .WithOne(t => t.Goal)
                .HasForeignKey(t => t.GoalId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

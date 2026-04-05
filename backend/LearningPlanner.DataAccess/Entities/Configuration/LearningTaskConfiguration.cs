using LearningPlanner.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningPlanner.Infrastructure.Entities.Configuration
{
    public class LearningTaskConfiguration : IEntityTypeConfiguration<LearningTaskEntity>
    {
        public void Configure(EntityTypeBuilder<LearningTaskEntity> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(b => b.Title).IsRequired();
            builder.Property(b => b.Description).IsRequired(false);
            builder.Property(b => b.Status).IsRequired();
            builder.Property(b => b.Order).IsRequired();
            builder.Property(b => b.CreatedAt).IsRequired();

            builder.HasOne(t => t.Goal)
                .WithMany(g => g.Tasks)
                .HasForeignKey(t => t.GoalId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

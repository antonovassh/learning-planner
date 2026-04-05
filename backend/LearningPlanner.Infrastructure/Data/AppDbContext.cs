modelBuilder.Entity<User>(entity =>
{
    entity.Property(u => u.RowVersion).IsConcurrencyToken(false);
});
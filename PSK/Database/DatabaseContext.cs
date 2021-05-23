using System;
using System.Diagnostics;
using Domain;
using Domain.Drives;
using Domain.StorageItems;
using Domain.Upload;
using Microsoft.EntityFrameworkCore;

namespace Database
    {
    public class DatabaseContext : DbContext, IDatabaseContext
        {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        public DbSet<Drive> Drives { get; set; }
        public DbSet<StorageItem> StorageItems { get; set; }
        public DbSet<UploadTransaction> UploadTransactions { get; set; }

        // For debugging generated sql queries
        // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //     => optionsBuilder.LogTo(message => Debug.WriteLine(message));

        protected override void OnModelCreating (ModelBuilder modelBuilder)
            {
            modelBuilder.Entity<StorageItem> (entity =>
                {
                entity.HasKey(x => x.Id);
                entity.Property(x => x.Name);
                entity.HasOne(x => x.Parent)
                    .WithMany(x => x.Children)
                    .HasForeignKey(x => x.ParentId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity<StorageItem>()
                        .Property(p => p.RowVersion).IsRowVersion();
            }
        }
    }
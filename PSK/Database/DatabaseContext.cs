using Domain;
using Domain.Drives;
using Domain.StorageItems;
using Microsoft.EntityFrameworkCore;

namespace Database
    {
    public class DatabaseContext : DbContext, IDatabaseContext
        {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base (options) { }

        public DbSet<Drive> Drives { get; set; }
        public DbSet<StorageItem> StorageItems { get; set; }
        }
    }
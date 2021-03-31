using Domain;
using Domain.Drives;
using Domain.StorageItems;
using Domain.Upload;
using Microsoft.EntityFrameworkCore;

namespace Database
    {
    public class DatabaseContext : DbContext, IDatabaseContext
        {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base (options) { }

        public DbSet<Drive> Drives { get; set; }
        public DbSet<StorageItem> StorageItems { get; set; }
        public DbSet<UploadTransaction> UploadTransactions { get; set; }
        }
    }
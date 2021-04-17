using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using Domain.Drives;
using Domain.StorageItems;
using Domain.Upload;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Domain
    {
    public interface IDatabaseContext : IDisposable
        {
        DbSet<Drive> Drives { get; set; }
        DbSet<StorageItem> StorageItems { get; set; }
        DbSet<UploadTransaction> UploadTransactions { get; set; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        EntityEntry<TEntity> Entry<TEntity>([NotNull] TEntity entity) where TEntity : class;
        }
    }
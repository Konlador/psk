using System;
using System.Threading;
using System.Threading.Tasks;
using Domain.Drives;
using Domain.StorageItems;
using Microsoft.EntityFrameworkCore;

namespace Domain
    {
    public interface IDatabaseContext : IDisposable
        {
        DbSet<Drive> Drives { get; set; }
        DbSet<StorageItem> StorageItems { get; set; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        }
    }
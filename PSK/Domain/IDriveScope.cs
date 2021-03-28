using Domain.StorageItems;
using System;

namespace Domain
    {
    public interface IDriveScope : IDisposable
        {
        Guid DriveId { get; }
        IStorageItemRepository StorageItems { get; }
        }
    }

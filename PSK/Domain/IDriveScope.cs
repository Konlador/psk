using Domain.StorageItems;
using Domain.Upload;
using System;

namespace Domain
    {
    public interface IDriveScope : IDisposable
        {
        Guid DriveId { get; }
        IStorageItemRepository StorageItems { get; }
        IUploadTransactionRepository UploadTransactions { get; }
        }
    }

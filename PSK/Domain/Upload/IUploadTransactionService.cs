using System;
using System.Threading;
using System.Threading.Tasks;
using Domain.StorageItems;

namespace Domain.Upload
    {
    public interface IUploadTransactionService
        {
        Uri GetDownloadUri(StorageItem item);

        Task<UploadTransaction> StartTransaction(StorageItem item, CancellationToken cancellationToken);

        Task<bool> CommitTransaction(Guid transactionId, StorageItem item, CancellationToken cancellationToken);

        Task<UploadTransaction> Rollback(Guid transactionId, CancellationToken cancellationToken);
        }
    }

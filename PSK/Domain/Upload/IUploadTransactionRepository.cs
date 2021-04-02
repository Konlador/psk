using System;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Upload
    {
    public interface IUploadTransactionRepository
        {
        Task<UploadTransaction> GetAsync(Guid transactionId, CancellationToken cancellationToken);

        Task<UploadTransaction> AddAsync(UploadTransaction transaction, CancellationToken cancellationToken);

        Task<UploadTransaction> RemoveAsync(Guid id, CancellationToken cancellationToken);
        }
    }

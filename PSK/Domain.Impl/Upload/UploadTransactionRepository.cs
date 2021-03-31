using Domain.Upload;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Impl.Upload
    {
    public class UploadTransactionRepository : IUploadTransactionRepository
        {
        private readonly IDatabaseContext m_dbContext;

        public UploadTransactionRepository(IDatabaseContext databaseContext)
            {
            m_dbContext = databaseContext;
            }

        public async Task<UploadTransaction> GetAsync(Guid transactionId, CancellationToken cancellationToken)
            {
            return await m_dbContext.UploadTransactions.FindAsync(transactionId);
            }

        public async Task<UploadTransaction> AddAsync(UploadTransaction transaction, CancellationToken cancellationToken)
            {
            var addedEntry = await m_dbContext.UploadTransactions.AddAsync(transaction, cancellationToken);
            await m_dbContext.SaveChangesAsync(cancellationToken);
            return addedEntry.Entity;
            }

        public async Task<UploadTransaction> RemoveAsync(Guid id, CancellationToken cancellationToken)
            {
            var transaction = await m_dbContext.UploadTransactions.FindAsync(id);
            if (null == transaction)
                return null;

            m_dbContext.UploadTransactions.Remove(transaction);
            await m_dbContext.SaveChangesAsync(cancellationToken);
            return transaction;
            }
        }
    }

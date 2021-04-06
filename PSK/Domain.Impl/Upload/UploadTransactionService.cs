using Domain.StorageItems;
using Domain.Upload;
using System;
using System.Threading;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;

namespace Domain.Impl.Upload
    {
    public class UploadTransactionService : IUploadTransactionService
        {
        private readonly BlobContainerClient m_blobContainerClient;
        private readonly IUploadTransactionRepository m_transactions;

        public UploadTransactionService(BlobContainerClient blobContainerClient,
                                        IUploadTransactionRepository transactions)
            {
            m_blobContainerClient = blobContainerClient;
            m_transactions = transactions;
            }

        public async Task<UploadTransaction> StartTransaction(StorageItem item, CancellationToken cancellationToken)
            {
            var transaction = new UploadTransaction
                                  {
                                  Id = Guid.NewGuid(),
                                  DriveId = item.DriveId,
                                  StorageItemId = item.Id,
                                  Timestamp = DateTime.UtcNow
                                  };

            transaction.UploadUri = m_blobContainerClient.GetBlobClient($"{item.DriveId}/{item.Name}")
                .GenerateSasUri(BlobSasPermissions.Read | BlobSasPermissions.Write, DateTime.UtcNow.AddHours(1));

            await m_transactions.AddAsync(transaction, cancellationToken);
            return transaction;
            }

        public async Task<bool> CommitTransaction(Guid transactionId, StorageItem item, CancellationToken cancellationToken)
            {
            var blob = m_blobContainerClient.GetBlobClient($"{item.DriveId}/{item.Name}");
            // TODO: check if size is the same as promised

            await blob.GetBlobLeaseClient().AcquireAsync(TimeSpan.MinValue, cancellationToken: cancellationToken);
            await m_transactions.RemoveAsync(transactionId, cancellationToken);
            return true;
            }

        public async Task<UploadTransaction> Rollback(Guid transactionId, CancellationToken cancellationToken)
            {
            throw new NotImplementedException();
            //var transaction = await m_transactions.GetAsync(transactionId, cancellationToken);

            //var blob = await m_blobContainerClient.GetBlobClient($"{item.DriveId}/{item.Name}").DeleteIfExistsAsync()
            //var blob = await m_cloudStorageAccount.CreateCloudBlobClient().GetBlobReferenceFromServerAsync(transaction.UploadUri);
            //await blob.DeleteIfExistsAsync();

            //return await m_transactions.RemoveAsync(transactionId, cancellationToken);
            }
        }
    }
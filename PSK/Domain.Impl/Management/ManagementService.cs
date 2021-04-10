using System;
using System.Threading;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Domain.Management;
using Domain.StorageItems;

namespace Domain.Impl.Management
    {
    public class ManagementService : IManagementService
        {
        private readonly BlobContainerClient m_blobContainerClient;

        public ManagementService(BlobContainerClient blobContainerClient)
            {
            m_blobContainerClient = blobContainerClient;
            }

        public Uri GetDownloadUri(StorageItem item)
            {
            var sasBuilder = new BlobSasBuilder
                                 {
                                 BlobContainerName = m_blobContainerClient.Name,
                                 BlobName = $"{item.DriveId}/{item.Id}",
                                 Resource = "b",
                                 ExpiresOn = DateTimeOffset.UtcNow.AddHours(1),
                                 ContentDisposition = $"attachment;filename={item.Name}"
                                 };

            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            return m_blobContainerClient.GetBlobClient($"{item.DriveId}/{item.Id}")
                                        .GenerateSasUri(sasBuilder);
            }

        public async Task DeleteStorageItem(IDriveScope driveScope, StorageItem item)
            {
            var blob = m_blobContainerClient.GetBlobClient($"{item.DriveId}/{item.Id}");
            await blob.GetBlobLeaseClient().BreakAsync();
            await blob.DeleteIfExistsAsync();

            await driveScope.StorageItems.RemoveAsync(item.Id, CancellationToken.None);
            }
        }
    }

using System;
using System.Linq;
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
        private class SubtreeStatistics
            {
                    public long storage = 0;
                    public int numberOfFiles = 0;
            }
        private readonly BlobContainerClient m_blobContainerClient;
        private readonly IGlobalScope m_globalScope;

        public ManagementService(BlobContainerClient blobContainerClient, IGlobalScope globalScope)
            {
            m_blobContainerClient = blobContainerClient;
            m_globalScope = globalScope;
            }

        public Uri GetDownloadUri(StorageItem item)
            {
            if(item.GetType() == typeof(Folder))
                throw new NotImplementedException("Don't support download links for folders.");

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

        public async Task DeleteStorageItem(IDriveScope driveScope, StorageItem item, CancellationToken cancellationToken)
            {
            var drive = await m_globalScope.Drives.GetAsync(item.DriveId, cancellationToken);
            SubtreeStatistics releasedStats = new SubtreeStatistics();

            try
            {
                await DeleteStorageItemRecursively(driveScope, item, releasedStats);
            }
            finally
            {
                drive.NumberOfFiles -= releasedStats.numberOfFiles;
                drive.TotalStorageUsed -= releasedStats.storage;
                await m_globalScope.Drives.UpdateAsync(drive, cancellationToken);
            }            

            }

        private async Task DeleteStorageItemRecursively(IDriveScope driveScope, StorageItem item, SubtreeStatistics driveStatistics)
            {

            if(item is Folder folder)
                {
                await driveScope.StorageItems.LoadFolderChildren(folder, CancellationToken.None);

                foreach(var folderChild in folder.Children.ToList())
                    await DeleteStorageItemRecursively(driveScope, folderChild, driveStatistics);
                }
            
            await DeleteBlob(item);

            driveStatistics.storage += item.Size;
            driveStatistics.numberOfFiles += 1;
            await driveScope.StorageItems.RemoveAsync(item.Id, CancellationToken.None);

            }

        private async Task DeleteBlob(StorageItem item)
            {
            var blob = m_blobContainerClient.GetBlobClient($"{item.DriveId}/{item.Id}");
            if((await blob.ExistsAsync()).Value)
                {
                await blob.GetBlobLeaseClient().BreakAsync();
                await blob.DeleteAsync();
                }
            }
        }
    }

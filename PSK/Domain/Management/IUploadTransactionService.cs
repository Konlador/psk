using Domain.StorageItems;
using System;
using System.Threading.Tasks;

namespace Domain.Management
    {
    public interface IManagementService
        {
        Uri GetDownloadUri(StorageItem item);

        Task DeleteStorageItem(IDriveScope driveScope, StorageItem item);
        }
    }

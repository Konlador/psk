using System;
using System.Threading.Tasks;
using Domain.StorageItems;

namespace Domain.Upload
    {
    public interface IUploadBlobProvider
        {
        Uri CreateUploadUri(StorageItem item, DateTimeOffset validUntil);

        Task CommitBlob(Uri blobUri, StorageItem item);

        Task Rollback(Uri blobUri);
        }
    }
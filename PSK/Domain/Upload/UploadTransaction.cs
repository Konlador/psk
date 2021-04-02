using System;

namespace Domain.Upload
    {
    public class UploadTransaction
        {
        public Guid Id { get; set; }

        public Guid DriveId { get; set; }

        public Guid StorageItemId { get; set; }

        public Uri UploadUri { get; set; }

        public DateTime Timestamp { get; set; }
        }
    }
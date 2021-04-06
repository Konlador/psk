using System;

namespace Domain.StorageItems
    {
    public enum StorageItemType
        {
        File,
        Folder
        }

    public enum StorageItemState
        {
        Uploading,
        Uploaded,
        Trashed
        }

    public class StorageItem
        {
        public Guid Id { get; set; }
        public Guid DriveId { get; set; }
        public Guid? ParentId { get; set; }
        public string Name { get; set; }
        public StorageItemType Type { get; set; }
        public DateTime TimeCreated { get; set; }
        public long Size { get; set; }
        public StorageItemState State { get; set; }
        public DateTime? TrashedTime { get; set; }
        }
    }
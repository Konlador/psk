using System;
using System.Collections.Generic;

namespace Domain.StorageItems
    {
    public enum StorageItemState
        {
        Uploading,
        Uploaded
        }

    public class StorageItem
        {
        public Guid Id { get; set; }

        public Guid DriveId { get; set; }

        /// <summary>
        /// The ID of the parent folder which contain the item.
        /// If null then the location of the item is the root folder of the drive.
        /// </summary>
        public Guid? ParentId { get; set; }

        public virtual Folder Parent { get; set; }

        public string Name { get; set; }

        public DateTime TimeCreated { get; set; }

        public long Size { get; set; }

        public StorageItemState State { get; set; }

        public bool Trashed { get; set; }

        /// <summary>
        /// Whether the file has been explicitly trashed, as opposed to recursively trashed from a parent folder.
        /// </summary>
        public bool TrashedExplicitly { get; set; }

        public DateTime? TrashedTime { get; set; }
        }

    public class Folder : StorageItem
        {
        public virtual ICollection<StorageItem> Children { get; set; } = new List<StorageItem>();
        }
    }
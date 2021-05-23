using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.StorageItems
    {
    public class StorageItemQuery
        {
        /// <summary>
        /// The states of items that are included in the query.
        /// If no states are specified, then all states are included.
        /// </summary>
        public StorageItemState[] States { get; set; }

        /// <summary>
        /// The ID of the parent/ancestor folder for items that are included in the query.
        /// If null, then all items in the drive are included.
        /// </summary>
        public Guid? ParentId { get; set; }

        /// <summary>
        /// When true, all descendants of the parent (if any) is flattened to a 1D list.
        /// </summary>
        public bool FlattenAllDescendants { get; set; } = false;

        public bool? IsTrashedExplicitly { get; set; }
        }

    public interface IStorageItemRepository
        {
        Task<IEnumerable<StorageItem>> GetWithQueryAsync(StorageItemQuery query, CancellationToken cancellationToken);

        Task<IEnumerable<Folder>> GetParentsAsync(StorageItem item, CancellationToken cancellationToken);

        Task<StorageItem> GetAsync(Guid itemId, CancellationToken cancellationToken);

        Task<StorageItem> AddAsync(StorageItem item, CancellationToken cancellationToken);

        Task<StorageItem> UpdateAsync(StorageItem item, byte[] rowVersion, CancellationToken cancellationToken);

        Task<bool> RemoveAsync(Guid itemId, CancellationToken cancellationToken);

        Task<StorageItem> TrashAsync(StorageItem item, DateTime trashTime, CancellationToken cancellationToken);

        Task<StorageItem> RestoreAsync(StorageItem item, CancellationToken cancellationToken);

        Task LoadFolderChildren(Folder folder, CancellationToken cancellationToken);
        }
    }

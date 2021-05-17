using Domain.StorageItems;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Impl
    {
    public class StorageItemRepository : IStorageItemRepository
        {
        private readonly Guid m_driveId;
        private readonly IDatabaseContext m_dbContext;

        public StorageItemRepository(IDatabaseContext databaseContext, Guid driveId)
            {
            m_dbContext = databaseContext;
            m_driveId = driveId;
            }

        public async Task<IEnumerable<StorageItem>> GetWithQueryAsync(StorageItemQuery query, CancellationToken cancellationToken)
            {
            if(query.FlattenAllDescendants && query.ParentId != null)
                return await GetWithQueryRecursively(query, cancellationToken);

            return await GetWithQuerySimple(query, cancellationToken);
            }

        private async Task<IEnumerable<StorageItem>> GetWithQuerySimple(
            StorageItemQuery query, CancellationToken cancellationToken)
            {
            var dbQuery = m_dbContext.StorageItems.Where(x => x.DriveId == m_driveId);
            if(query != null)
                {
                dbQuery = dbQuery.Where(x =>
                                            (query.FlattenAllDescendants || x.ParentId == query.ParentId) &&
                                            (query.States == null || query.States.Length == 0 || query.States.Contains(x.State)) &&
                                            (query.IsTrashedExplicitly == null || query.IsTrashedExplicitly == x.TrashedExplicitly));
                }

            return await dbQuery.ToListAsync(cancellationToken);
            }

        private Task<IEnumerable<StorageItem>> GetWithQueryRecursively(StorageItemQuery query, CancellationToken cancellationToken)
            {
            var filteredItems = new List<StorageItem>();

            var items = m_dbContext.StorageItems
                                   .Where(x => x.DriveId == m_driveId && x.ParentId == query.ParentId)
                                   .ToList();

            FilterItemsRecursively(items, query, filteredItems);

            return Task.FromResult((IEnumerable<StorageItem>) filteredItems);
            }

        private void FilterItemsRecursively(IEnumerable<StorageItem> itemsToFilter, StorageItemQuery query, ICollection<StorageItem> filteredItems)
            {
            foreach(var itemToFilter in itemsToFilter)
                {
                if(query.States == null || query.States.Length == 0 || query.States.Contains(itemToFilter.State))
                    filteredItems.Add(itemToFilter);
                if(itemToFilter is not Folder folder) continue;

                m_dbContext.Entry(folder)
                           .Collection(x => x.Children)
                           .Load();

                FilterItemsRecursively(folder.Children, query, filteredItems);
                }
            }

        public Task<IEnumerable<Folder>> GetParentsAsync(StorageItem item, CancellationToken cancellationToken)
            {
            var parentFolders = new List<Folder>();
            while(true)
                {
                m_dbContext.Entry(item)
                           .Reference(x => x.Parent)
                           .Load();

                if(item?.Parent == null) break;
                parentFolders.Add(item.Parent);
                item = item.Parent;
                }

            return Task.FromResult((IEnumerable<Folder>) parentFolders);
            }

        public async Task<StorageItem> GetAsync(Guid itemId, CancellationToken cancellationToken)
            {
            return await m_dbContext.StorageItems.FindAsync(itemId);
            }

        public async Task<StorageItem> AddAsync(StorageItem item, CancellationToken cancellationToken)
            {
            var addedEntry = await m_dbContext.StorageItems.AddAsync(item, cancellationToken);
            await m_dbContext.SaveChangesAsync(cancellationToken);
            return addedEntry.Entity;
            }

        public async Task<StorageItem> UpdateAsync(StorageItem item, CancellationToken cancellationToken)
            {
            var modifiedEntry = m_dbContext.StorageItems.Attach(item);
            await m_dbContext.SaveChangesAsync(cancellationToken);
            return modifiedEntry.Entity;
            }

        public async Task<bool> RemoveAsync(Guid itemId, CancellationToken cancellationToken)
            {
            var item = await m_dbContext.StorageItems.FindAsync(itemId);
            if (null == item)
                return false;

            m_dbContext.StorageItems.Remove(item);
            await m_dbContext.SaveChangesAsync(cancellationToken);
            return true;
            }

        public async Task<StorageItem> TrashAsync(StorageItem item, DateTime trashTime, CancellationToken cancellationToken)
            {
            await TrashRecursively(item, trashTime, cancellationToken);
            item.TrashedTime = trashTime;
            item.TrashedExplicitly = true;
            await m_dbContext.SaveChangesAsync(cancellationToken);
            return item;
            }

        private async Task TrashRecursively(StorageItem item, DateTime trashTime, CancellationToken cancellationToken)
            {
            if(item.Trashed) return;
            item.Trashed = true;
            item.TrashedTime = trashTime;

            if(item is not Folder folder) return;

            await LoadFolderChildren(folder, cancellationToken);

            foreach(var child in folder.Children)
                await TrashRecursively(child, trashTime, cancellationToken);
            }

        public async Task<StorageItem> RestoreAsync(StorageItem item, CancellationToken cancellationToken)
            {
            item.TrashedExplicitly = false;
            await RestoreRecursively(item, cancellationToken);
            await m_dbContext.SaveChangesAsync(cancellationToken);
            return item;
            }

        private async Task RestoreRecursively(StorageItem item, CancellationToken cancellationToken)
            {
            if(item.TrashedExplicitly) return;
            item.Trashed = false;
            item.TrashedTime = null;

            if(item is not Folder folder) return;

            await LoadFolderChildren(folder, cancellationToken);

            foreach(var child in folder.Children)
                await RestoreRecursively(child, cancellationToken);
            }

        public async Task LoadFolderChildren(Folder folder, CancellationToken cancellationToken)
            {
            await m_dbContext.Entry(folder)
                             .Collection(x => x.Children)
                             .LoadAsync(cancellationToken);
            }
        }
    }

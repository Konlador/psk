using Domain.StorageItems;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Azure.Storage.Blobs.Models;

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

        public async Task<IEnumerable<StorageItem>> GetAllAsync(StorageItemState[] states, CancellationToken cancellationToken)
            {
            return await m_dbContext.StorageItems
                                    .Where(x =>
                                        x.DriveId == m_driveId &&
                                        (states.Length == 0 || states.Contains(x.State))
                                    )
                                    .ToListAsync(cancellationToken);
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
        }
    }

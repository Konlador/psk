﻿using Domain.Drives;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.StorageItems
    {
    public interface IStorageItemRepository
        {
        Task<IEnumerable<StorageItem>> GetAllAsync(CancellationToken cancellationToken);

        Task<StorageItem> GetAsync(Guid itemId, CancellationToken cancellationToken);

        Task<StorageItem> AddAsync(StorageItem item, CancellationToken cancellationToken);

        Task<bool> RemoveAsync(Guid itemId, CancellationToken cancellationToken);
        }
    }
using Domain.StorageItems;
using System;

namespace Domain.Impl
    {
    public class DriveScope : IDriveScope
        {
        private readonly IDatabaseContext m_dbContext;

        public Guid DriveId { get; }
        public IStorageItemRepository StorageItems { get; }

        public DriveScope(IDatabaseContext databaseContext, Guid driveId)
            {
            m_dbContext = databaseContext;
            DriveId = driveId;
            StorageItems = new StorageItemRepository(databaseContext, driveId);
            }

        public void Dispose()
            {
            m_dbContext?.Dispose();
            }
        }
    }

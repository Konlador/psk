using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain.Drives;
using Microsoft.EntityFrameworkCore;

namespace Domain.Impl
    {
    public class DriveRepository : IDriveRepository
        {
        private readonly IDatabaseContext m_dbContext;

        public DriveRepository(IDatabaseContext databaseContext)
            {
            m_dbContext = databaseContext;
            }

        public async Task<IEnumerable<Drive>> GetAllAsync(CancellationToken cancellationToken)
            {
            return await m_dbContext.Drives.ToListAsync(cancellationToken);
            }

        public async Task<Drive> GetAsync(Guid driveId, CancellationToken cancellationToken)
            {
            return await m_dbContext.Drives.FindAsync(driveId);
            }

        public async Task<Drive> AddAsync(Drive drive, CancellationToken cancellationToken)
            {
            var addedEntry = await m_dbContext.Drives.AddAsync(drive, cancellationToken);
            await m_dbContext.SaveChangesAsync(cancellationToken);
            return addedEntry.Entity;
            }

        public async Task<bool> RemoveAsync(Guid driveId, CancellationToken cancellationToken)
            {
            var drive = await m_dbContext.Drives.FindAsync(driveId);
            if (null == drive)
                return false;

            m_dbContext.Drives.Remove(drive);
            await m_dbContext.SaveChangesAsync(cancellationToken);
            return true;
            }

        public async Task<bool> ExistsAsync(Guid driveId, CancellationToken cancellationToken)
            {
            return await m_dbContext.Drives.FindAsync(driveId) != null;
            }
        }
    }

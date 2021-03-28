using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Drives
    {
    public interface IDriveRepository
        {
        Task<IEnumerable<Drive>> GetAllAsync(CancellationToken cancellationToken);

        Task<Drive> GetAsync(Guid driveId, CancellationToken cancellationToken);

        Task<Drive> AddAsync(Drive drive, CancellationToken cancellationToken);

        Task<bool> RemoveAsync(Guid driveId, CancellationToken cancellationToken);

        Task<bool> ExistsAsync(Guid driveId, CancellationToken cancellationToken);
        }
    }

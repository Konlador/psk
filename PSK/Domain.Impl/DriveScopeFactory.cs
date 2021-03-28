using Microsoft.Extensions.DependencyInjection;
using System;

namespace Domain.Impl
    {
    public class DriveScopeFactory : IDriveScopeFactory
        {
        private readonly IServiceProvider m_serviceProvider;
        private readonly Guid m_driveId;

        public DriveScopeFactory(IServiceProvider serviceProvider, Guid driveId)
            {
            m_serviceProvider = serviceProvider;
            m_driveId = driveId;
            }

        public IDriveScope CreateInstance()
            {
            var dbContext = m_serviceProvider.GetRequiredService<IDatabaseContext>();
            return new DriveScope(dbContext, m_driveId);
            }
        }
    }

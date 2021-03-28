using Domain.Drives;

namespace Domain.Impl
    {
    public class GlobalScope : IGlobalScope
        {
        public IDriveRepository Drives { get; set; }

        public GlobalScope(IDriveRepository driveRepository)
            {
            Drives = driveRepository;
            }
        }
    }

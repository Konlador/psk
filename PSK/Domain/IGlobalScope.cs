using Domain.Drives;

namespace Domain
    {
    public interface IGlobalScope
        {
        IDriveRepository Drives { get; }
        }
    }


﻿using System;

namespace Domain.Drives
{
    public class Drive
        {
        public Guid Id { get; set; }

        public long Capacity { get; set; }

        public long TotalStorageUsed { get; set; }

        public long NumberOfFiles { get; set; }
    }
}
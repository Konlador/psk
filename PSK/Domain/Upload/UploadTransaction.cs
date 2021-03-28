using System;

namespace Domain.Upload
    {
    public class UploadTransaction
        {
        public Guid Id { get; set; }

        public string UploadUri { get; set; }

        public DateTime Timestamp { get; set; }
        }
    }
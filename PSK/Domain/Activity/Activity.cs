using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Activity
    {
    public abstract class Activity
        {
        public Guid Id { get; set; }
        public List<Guid> RelatedStorageItems { get; set; }
        }

    public class CreateActivity : Activity
        {
        public DateTime TimeCreated { get; set; }
        }

    public class ContentModifyActivity : Activity
        {
        public DateTime TimeModified { get; set; }
        }

    public class StorageItemRenameActivity : Activity
        {
        public string From { get; set; }
        public string To { get; set; }
        }
    }

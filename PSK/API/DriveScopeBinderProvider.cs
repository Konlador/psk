using Domain;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace API
    {
    public class DriveScopeBinderProvider : IModelBinderProvider
        {
        public IModelBinder GetBinder(ModelBinderProviderContext context)
            {
            return context.Metadata.ModelType == typeof(IDriveScopeFactory) ? new DriveScopeBinder() : null;
            }
        }
    }
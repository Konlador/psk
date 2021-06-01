using Domain;
using Domain.Impl;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain.Drives;
using Microsoft.Extensions.DependencyInjection;

namespace MediaDriveApp
    {
    public class DriveScopeBinder : IModelBinder
        {
        public async Task BindModelAsync(ModelBindingContext bindingContext)
            {
            if (bindingContext == null)
                {
                throw new ArgumentNullException(nameof (bindingContext));
                }

            var compositeValueProvider = bindingContext.ValueProvider as CompositeValueProvider;
            var valueProvider = compositeValueProvider?.Single(x => x is RouteValueProvider);
            var valueProviderResult = valueProvider?.GetValue("driveId");
            var driveIdString = valueProviderResult?.FirstValue;
            if (driveIdString == null)
                throw new Exception("No driveId specified.");
            var driveId = Guid.Parse(driveIdString);

            var serviceProvider = bindingContext.HttpContext.RequestServices;
            var globalScope = serviceProvider.GetRequiredService<IGlobalScope>();

            if (!await globalScope.Drives.ExistsAsync(driveId, CancellationToken.None))
                {
                var newDrive = new Drive
                                   {
                                   Id = driveId,
                                   Capacity = 1000000000
                                   };

                await globalScope.Drives.AddAsync(newDrive, CancellationToken.None);
                Debug.WriteLine($"Added a new drive {driveId}");
                }

            var driveScopeFactory = new DriveScopeFactory(bindingContext.HttpContext.RequestServices, driveId);
            bindingContext.Result = ModelBindingResult.Success(driveScopeFactory);
            }
        }
    }
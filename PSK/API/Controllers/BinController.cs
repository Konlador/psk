using Domain;
using Domain.Management;
using Domain.StorageItems;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace API.Controllers
    {
    [ApiController]
    [Route("api/drive/{driveId:guid}")]
    public class BinController : ControllerBase
        {
        private readonly IManagementService m_managementService;

        public BinController(IManagementService managementService)
            {
            m_managementService = managementService;
            }

        [HttpPost]
        [Route("files/{itemId:guid}/trash")]
        public async Task<ActionResult<StorageItem>> Trash(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            Guid itemId, CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();

            var item = await driveScope.StorageItems.GetAsync(itemId, cancellationToken);
            if(item == null)
                return NotFound();
            if(item.Trashed)
                return BadRequest("File already trashed.");
            if(item.State != StorageItemState.Uploaded)
                return BadRequest("Storage item is not uploaded.");

            var i = await driveScope.StorageItems.TrashAsync(item, DateTime.UtcNow, cancellationToken);
            return Ok(new
                          {
                          i.Id, i.DriveId, i.ParentId, i.Name, i.TimeCreated, i.Size,
                          i.State, i.Trashed, i.TrashedExplicitly, i.TrashedTime
                          });
            }

        [HttpPost]
        [Route("files/{itemId:guid}/restore")]
        public async Task<ActionResult<StorageItem>> Restore(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            Guid itemId, CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();

            var item = await driveScope.StorageItems.GetAsync(itemId, cancellationToken);
            if(item == null)
                return NotFound();

            if(!item.TrashedExplicitly)
                return BadRequest($"Item with the id '{item.Id}' is not trashed explicitly.");

            var i = await driveScope.StorageItems.RestoreAsync(item, cancellationToken);
            return Ok(new
                          {
                          i.Id, i.DriveId, i.ParentId, i.Name, i.TimeCreated, i.Size,
                          i.State, i.Trashed, i.TrashedExplicitly, i.TrashedTime
                          });
            }

        [HttpDelete]
        [Route("files/{itemId:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            Guid itemId, CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();

            var item = await driveScope.StorageItems.GetAsync(itemId, cancellationToken);
            if(item == null)
                return NotFound();

            if(!item.TrashedExplicitly)
                return BadRequest("File is not trashed explicitly.");

            await m_managementService.DeleteStorageItem(driveScope, item);
            return Ok();
            }
        }
    }

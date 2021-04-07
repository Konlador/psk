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

            if(item.State == StorageItemState.Trashed)
                return BadRequest("File already trashed.");
            if(item.State != StorageItemState.Uploaded)
                return BadRequest("Storage item is not uploaded.");

            item.State = StorageItemState.Trashed;
            item.TrashedTime = DateTime.UtcNow;

            await driveScope.StorageItems.UpdateAsync(item, cancellationToken);
            return Ok(item);
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

            if(item.State != StorageItemState.Trashed)
                return BadRequest("File is not trashed.");

            item.State = StorageItemState.Uploaded;
            item.TrashedTime = null;

            await driveScope.StorageItems.UpdateAsync(item, cancellationToken);
            return Ok(item);
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
                {
                return NotFound();
                }

            await m_managementService.DeleteStorageItem(driveScope, item);
            return Ok();
            }
        }
    }

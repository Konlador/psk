using Domain;
using Domain.StorageItems;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace MediaDriveApp.Controllers
    {
    [ApiController]
    [Route("api/drive/{driveId:guid}")]
    public class FileManagementController : ControllerBase
        {
        [HttpPatch]
        [Route("files/{itemId:guid}/rename")]
        public async Task<ActionResult<string>> Rename(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            Guid itemId, [FromQuery, BindRequired] string newName, [FromQuery, BindRequired] byte[] rowVersion, CancellationToken cancellationToken)
            {
            if(string.IsNullOrWhiteSpace(newName))
                return BadRequest("Name is required");
            if(rowVersion == null)
                return BadRequest("RowVersion is required");

            newName = newName.Trim();

            using var driveScope = driveScopeFactory.CreateInstance();
            var item = await driveScope.StorageItems.GetAsync(itemId, cancellationToken);
            if(item == null)
                return NotFound();

            item.Name = newName;

            try
                {
                await driveScope.StorageItems.UpdateAsync(item, rowVersion ,cancellationToken);
                }
            catch(DbUpdateConcurrencyException)
                {
                return BadRequest(
                    "This item you attempted to rename was modified by another request after you got the item information.");
                }

            return Ok(item);
            }

        [HttpPost]
        [Route("new-folder")]
        public async Task<ActionResult<string>> CreateFolder(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            StorageItem item, CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();

            if(item.ParentId != null)
                {
                var parentFolder = await driveScope.StorageItems.GetAsync((Guid)item.ParentId, cancellationToken);
                if(parentFolder == null)
                    return NotFound($"Folder {item.ParentId} does not exist.");
                if(parentFolder.GetType() != typeof(Folder))
                    return BadRequest($"Item {item.ParentId} is not a folder.");
                }

            var folderName = item.Name;
            if(string.IsNullOrWhiteSpace(folderName))
                return BadRequest("Folder name can not be empty or only white space.");
            folderName = folderName.Trim();

            var folder = new Folder
                             {
                             Id = Guid.NewGuid(),
                             DriveId = driveScope.DriveId,
                             TimeCreated = DateTime.UtcNow,
                             ParentId = item.ParentId,
                             Name = folderName,
                             State = StorageItemState.Uploaded
                             };

            await driveScope.StorageItems.AddAsync(folder, cancellationToken);
            return Ok(folder);
            }

        [HttpPut]
        [Route("files/{itemId:guid}/move")]
        public async Task<ActionResult<StorageItem>> CreateFolder(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            Guid itemId, Guid? newParentId, CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();

            if(newParentId != null)
                {
                var parentFolder = await driveScope.StorageItems.GetAsync((Guid) newParentId, cancellationToken);
                if(parentFolder == null)
                    return NotFound($"Folder {newParentId} does not exist.");
                if(parentFolder is not Folder)
                    return BadRequest($"Item {newParentId} is not a folder.");
                }

            var item = await driveScope.StorageItems.GetAsync(itemId, cancellationToken);
            if(item == null)
                return NotFound($"Item {itemId} does not exist.");
            if(item.Trashed)
                return BadRequest("Can not move trashed items.");

            item.ParentId = newParentId;

            var i = await driveScope.StorageItems.UpdateAsync(item, null, cancellationToken);
            return Ok(new
                          {
                          i.Id, i.DriveId, i.ParentId, i.Name, i.TimeCreated, i.Size,
                          i.State, i.Trashed, i.TrashedExplicitly, i.TrashedTime
                          });
            }
        }
    }

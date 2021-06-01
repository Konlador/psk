using Domain;
using Domain.Management;
using Domain.StorageItems;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace MediaDriveApp.Controllers
    {
    [AllowAnonymous]
    [ApiController]
    [Route("api/drive/{driveId:guid}")]
    public class FileExplorerController : ControllerBase
        {
        private readonly IManagementService m_managementService;

        public FileExplorerController(IManagementService managementService)
            {
            m_managementService = managementService;
            }

        [HttpGet]
        [Route("files")]
        public async Task<ActionResult<dynamic>> GetFiles(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            [FromQuery] StorageItemQuery query,
            CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();

            IEnumerable<dynamic> parentsResult;
            if(query.ParentId == null)
                {
                parentsResult = Array.Empty<Folder>();
                }
            else
                {
                var directFolder = await driveScope.StorageItems.GetAsync((Guid) query.ParentId, cancellationToken);
                if(directFolder == null || directFolder.GetType() != typeof(Folder))
                    return BadRequest($"No folder found with id '{query.ParentId}'.");

                var parents = (await driveScope.StorageItems.GetParentsAsync(directFolder, cancellationToken)).ToList();
                parents.Insert(0, (Folder) directFolder);
                parentsResult = parents.Select(p => new { p.Id, p.DriveId, p.Name, p.ParentId });
                }

            var items = await driveScope.StorageItems.GetWithQueryAsync(query, cancellationToken);
            var itemsResult = items.Select(i => new
                                          {
                                          i.Id, i.DriveId, i.ParentId, i.Name, i.TimeCreated, i.Size,
                                          i.State, i.Trashed, i.TrashedExplicitly, i.TrashedTime,
                                          i.RowVersion
                                          });

            return Ok(new {Parents = parentsResult, Items = itemsResult});
            }

        [HttpGet]
        [Route("files/{id}")]
        public async Task<ActionResult<dynamic>> GetFile(
           [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
           [FromRoute] Guid id, CancellationToken cancellationToken)
        {
            using var driveScope = driveScopeFactory.CreateInstance();

            var file = await driveScope.StorageItems.GetAsync(id, cancellationToken);

            if(file == null)
            {
                return NotFound();
            }

            return Ok(file);
        }

        [HttpGet]
        [Route("files/{itemId:guid}/download")]
        public async Task<ActionResult<string>> GetDownloadUri(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            Guid itemId, CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();
            var item = await driveScope.StorageItems.GetAsync(itemId, cancellationToken);
            if(item == null)
                return NotFound();

            var uri = m_managementService.GetDownloadUri(item);

            return Ok(uri);
            }
        }
    }
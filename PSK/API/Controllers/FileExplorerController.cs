using Domain;
using Domain.Management;
using Domain.StorageItems;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace API.Controllers
    {
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
        public async Task<ActionResult<IEnumerable<StorageItem>>> GetAll(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            CancellationToken cancellationToken,
            [FromQuery] StorageItemState[] states)
            {
            using var driveScope = driveScopeFactory.CreateInstance();
            return Ok(await driveScope.StorageItems.GetAllAsync(states, cancellationToken));
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

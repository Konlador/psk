using Domain;
using Domain.Management;
using Domain.StorageItems;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace API.Controllers
    {
    [ApiController]
    [Route("api/drive/{driveId:guid}")]
    public class FileManagementController : ControllerBase
        {
        private readonly IManagementService m_managementService;

        public FileManagementController(IManagementService managementService)
            {
            m_managementService = managementService;
            }

        [HttpPut]
        [Route("files/{itemId:guid}/rename")]
        public async Task<ActionResult<string>> Rename(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            Guid itemId, [FromQuery, BindRequired] string newName, CancellationToken cancellationToken)
            {
            if(string.IsNullOrWhiteSpace(newName))
                return BadRequest("");

            newName = newName.Trim();

            using var driveScope = driveScopeFactory.CreateInstance();
            var item = await driveScope.StorageItems.GetAsync(itemId, cancellationToken);
            if(item == null)
                return NotFound();

            item.Name = newName;

            await driveScope.StorageItems.UpdateAsync(item, cancellationToken);
            return Ok(item);
            }
        }
    }

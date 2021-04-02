using Domain;
using Domain.Drives;
using Domain.StorageItems;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using API.Attributes;

namespace API.Controllers
    {
    [ApiController]
    [Route("[controller]")]
    [AllowAnonymous]
    [Authorize]
    [AuthorizeDrive] //custom attribute, like annotation
    public class StorageItemsController : ControllerBase
        {
        [HttpGet]
        [Route("{driveId:guid}")]
        public async Task<ActionResult<IEnumerable<Drive>>> GetAll(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();
            var name = HttpContext.User.Identity.Name; //email -> hash it
          
            try
                {
                return Ok(await driveScope.StorageItems.GetAllAsync(cancellationToken));
                }
            catch (Exception)
                {
                return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }

        [HttpGet]
        [Route("{driveId:guid}/{itemId:guid}")]
        public async Task<ActionResult<Drive>> Get(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            Guid itemId,
            CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();
            try
                {
                return Ok(await driveScope.StorageItems.GetAsync(itemId, cancellationToken));
                }
            catch (Exception)
                {
                return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }

        [HttpPost]
        [Route("{driveId:guid}")]
        public async Task<ActionResult<Drive>> Post(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            [FromBody] StorageItem item,
            CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();
            try
                {
                return Ok(await driveScope.StorageItems.AddAsync(item, cancellationToken));
                }
            catch (Exception)
                {
                return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }

        [HttpDelete]
        [Route("{driveId:guid}/{itemId:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            Guid itemId,
            CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();
            try
                {
                if (await driveScope.StorageItems.RemoveAsync(itemId, cancellationToken))
                    return Ok();

                return NotFound();
                }
            catch (Exception)
                {
                return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }
        }
    }
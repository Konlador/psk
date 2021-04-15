using Domain;
using Domain.Drives;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace API.Controllers
    {
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class DrivesController : ControllerBase
        {
        private readonly IGlobalScope m_globalScope;

        public DrivesController(IGlobalScope globalScope)
            {
            m_globalScope = globalScope;
            }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Drive>>> GetAll(CancellationToken cancellationToken)
            {
            try
                {
                return Ok(await m_globalScope.Drives.GetAllAsync(cancellationToken));
                }
            catch (Exception)
                {
                return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }

        [HttpGet]
        [Route("{driveId:guid}")]
        public async Task<ActionResult<Drive>> Get(Guid driveId, CancellationToken cancellationToken)
            {
            try
                {
                var drive = await m_globalScope.Drives.GetAsync(driveId, cancellationToken);
                if (null == drive)
                    return NotFound();

                return Ok(drive);
                }
            catch (Exception)
                {
                return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }

        [HttpPost]
        public async Task<ActionResult<Drive>> Post(CancellationToken cancellationToken)
            {
            var drive = new Drive
                            {
                            Id = Guid.NewGuid(),
                            Capacity = 1000000
                            };

            try
                {
                return Ok(await m_globalScope.Drives.AddAsync(drive, cancellationToken));
                }
            catch (Exception)
                {
                return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }

        [HttpDelete]
        [Route("{driveId:guid}")]
        public async Task<ActionResult> Delete(Guid driveId, CancellationToken cancellationToken)
            {
            try
                {
                if (await m_globalScope.Drives.RemoveAsync(driveId, cancellationToken))
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
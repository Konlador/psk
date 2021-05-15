using Domain;
using Domain.Drives;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MediaDriveApp.Controllers
    {
    [ApiController]
    [Route("api/drives")]
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
            return Ok(await m_globalScope.Drives.GetAllAsync(cancellationToken));
            }

        [HttpGet]
        [Route("{driveId:guid}")]
        public async Task<ActionResult<Drive>> Get(Guid driveId, CancellationToken cancellationToken)
            {
            var drive = await m_globalScope.Drives.GetAsync(driveId, cancellationToken);
            if (null == drive)
                return NotFound();

            return Ok(drive);
            }

        [HttpPost]
        public async Task<ActionResult<Drive>> Post(CancellationToken cancellationToken)
            {
            var drive = new Drive
                            {
                            Id = Guid.NewGuid(),
                            Capacity = 1000000
                            };

            return Ok(await m_globalScope.Drives.AddAsync(drive, cancellationToken));
            }

        [HttpDelete]
        [Route("{driveId:guid}")]
        public async Task<ActionResult> Delete(Guid driveId, CancellationToken cancellationToken)
            {
            if (await m_globalScope.Drives.RemoveAsync(driveId, cancellationToken))
                return Ok();

            return NotFound();
            }
        }
    }

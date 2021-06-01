using Domain;
using Domain.Drives;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace MediaDriveApp.Controllers
    {
    [AllowAnonymous]
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
        [Route("{driveId:guid}")]
        public async Task<ActionResult<Drive>> Get(Guid driveId, CancellationToken cancellationToken)
            {
            var drive = await m_globalScope.Drives.GetAsync(driveId, cancellationToken);

            if(null == drive)
                {
                var newDrive = new Drive
                                   {
                                   Id = driveId,
                                   Capacity = 1000000000
                                   };

                await m_globalScope.Drives.AddAsync(newDrive, CancellationToken.None);
                Debug.WriteLine($"Added a new drive {driveId}");
                }

            if (null == drive)
                return NotFound();

            return Ok(drive);
            }
        }
    }

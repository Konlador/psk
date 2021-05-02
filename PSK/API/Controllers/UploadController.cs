using Domain;
using Domain.Drives;
using Domain.StorageItems;
using Domain.Upload;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace API.Controllers
    {

    [ApiController]
    [Route("api/drive/{driveId:guid}")]
    public class UploadController : ControllerBase
        {
        private readonly IUploadTransactionService m_uploadTransactionService;
        private readonly IUploadTransactionRepository m_transactions;
        private readonly IGlobalScope m_globalScope;

        public UploadController(IUploadTransactionService uploadTransactionService,
                                IUploadTransactionRepository transactions, IGlobalScope globalScope)
            {
            m_uploadTransactionService = uploadTransactionService;
            m_transactions = transactions;
            m_globalScope = globalScope;
            }

        [HttpPost]
        [Route("upload")]
        public async Task<ActionResult<UploadTransaction>> StartUploadTransaction(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            StorageItem item, CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();
            var drive = await m_globalScope.Drives.GetAsync(driveScope.DriveId, cancellationToken);
            if (drive.Capacity - drive.TotalStorageUsed < item.Size)
            {
                return BadRequest("Not enough space in Drive"); 
            }

            if(item.ParentId != null)
                {
                var parentFolder = await driveScope.StorageItems.GetAsync((Guid) item.ParentId, cancellationToken);
                if(parentFolder == null)
                    return NotFound($"Folder {item.ParentId} does not exist.");
                if(parentFolder.GetType() != typeof(Folder))
                    return BadRequest($"Item {item.ParentId} is not a folder.");
                }

            var fileName = item.Name;
            if(string.IsNullOrWhiteSpace(fileName))
                return BadRequest("File name can not be empty or only white space.");
            fileName = fileName.Trim();

            var file = new StorageItem
                           {
                           Id = Guid.NewGuid(),
                           DriveId = driveScope.DriveId,
                           Name = fileName,
                           State = StorageItemState.Uploading,
                           TimeCreated = DateTime.UtcNow,
                           Size = item.Size
                           };
            var transaction = await m_uploadTransactionService.StartTransaction(file, cancellationToken);
            await driveScope.StorageItems.AddAsync(file, cancellationToken);

            return transaction;
            }

        [HttpPut]
        [Route("upload/{transactionId:guid}")]
        public async Task<ActionResult<bool>> CommitUploadTransaction(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory, Guid transactionId, CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();

            var drive = await m_globalScope.Drives.GetAsync(driveScope.DriveId, cancellationToken);
            var transaction = await m_transactions.GetAsync(transactionId, cancellationToken);
            var item = await driveScope.StorageItems.GetAsync(transaction.StorageItemId, cancellationToken);

            item.State = StorageItemState.Uploaded;
            await driveScope.StorageItems.UpdateAsync(item, cancellationToken);

            if (await m_uploadTransactionService.CommitTransaction(transactionId, item, cancellationToken))
                {
                drive.NumberOfFiles += 1;
                drive.TotalStorageUsed += item.Size;
                await m_globalScope.Drives.UpdateAsync(drive, cancellationToken);
                return Ok();
                }

            else
                {
                await driveScope.StorageItems.RemoveAsync(transaction.StorageItemId, cancellationToken);
                await m_transactions.RemoveAsync(transactionId, cancellationToken);
                return BadRequest("File size is different than promised");
                }

            }

    }
    }

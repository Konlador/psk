using Domain;
using Domain.StorageItems;
using Domain.Upload;
using Microsoft.AspNetCore.Mvc;
using System;
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

        public UploadController(IUploadTransactionService uploadTransactionService,
                                IUploadTransactionRepository transactions)
            {
            m_uploadTransactionService = uploadTransactionService;
            m_transactions = transactions;
            }

        [HttpPost]
        [Route("upload")]
        public async Task<UploadTransaction> StartUploadTransaction(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            StorageItem item, CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();

            item.Id = Guid.NewGuid();
            item.DriveId = driveScope.DriveId;
            item.State = StorageItemState.Uploading;
            var transaction = await m_uploadTransactionService.StartTransaction(item, cancellationToken);
            await driveScope.StorageItems.AddAsync(item, cancellationToken);

            return transaction;
            }

        [HttpPut]
        [Route("upload/{transactionId:guid}")]
        public async Task<ActionResult<bool>> CommitUploadTransaction(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory, Guid transactionId, CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();

            var transaction = await m_transactions.GetAsync(transactionId, cancellationToken);
            var item = await driveScope.StorageItems.GetAsync(transaction.StorageItemId, cancellationToken);
            item.State = StorageItemState.Uploaded;
            await driveScope.StorageItems.UpdateAsync(item, cancellationToken);

            return Ok(await m_uploadTransactionService.CommitTransaction(transactionId, item, cancellationToken));
            }
        }
    }

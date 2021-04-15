using Domain;
using Domain.StorageItems;
using Domain.Upload;
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
    [Authorize]
    public class StorageItemsController : ControllerBase
        {
        private readonly IUploadTransactionService m_uploadTransactionService;
        private readonly IUploadTransactionRepository m_transactions;

        public StorageItemsController(IUploadTransactionService uploadTransactionService,
                                      IUploadTransactionRepository transactions)
            {
            m_uploadTransactionService = uploadTransactionService;
            m_transactions = transactions;
            }

        [HttpGet]
        [Route("metadata/{driveId:guid}")]
        [AuthorizeDrive]
        public async Task<ActionResult<IEnumerable<StorageItem>>> GetAll(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();
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
        [Route("metadata/{driveId:guid}/{itemId:guid}")]
        public async Task<ActionResult<StorageItem>> Get(
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

        [HttpGet]
        [Route("download/{driveId:guid}/{itemId:guid}")]
        public async Task<ActionResult<string>> GetDownloadUri(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory,
            Guid itemId, CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();
            try
                {
                var item = await driveScope.StorageItems.GetAsync(itemId, cancellationToken);
                if(item == null)
                    return NotFound();

                var uri = m_uploadTransactionService.GetDownloadUri(item);

                return Ok(uri);
                }
            catch(Exception)
                {
                return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }

        [HttpPost]
        [Route("upload/{driveId:guid}")]
        public async Task<UploadTransaction> Post(
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
        [Route("upload/{driveId:guid}/{transactionId:guid}")]
        public async Task<ActionResult<bool>> Put(
            [FromRoute, ModelBinder] IDriveScopeFactory driveScopeFactory, Guid transactionId, CancellationToken cancellationToken)
            {
            using var driveScope = driveScopeFactory.CreateInstance();

            var transaction = await m_transactions.GetAsync(transactionId, cancellationToken);
            var item = await driveScope.StorageItems.GetAsync(transaction.StorageItemId, cancellationToken);
            item.State = StorageItemState.Uploaded;
            await driveScope.StorageItems.UpdateAsync(item, cancellationToken);

            return Ok(await m_uploadTransactionService.CommitTransaction(transactionId, item, cancellationToken));
            }

        #region Temporary
        // TODO: This delete is only temporary
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
        #endregion
        }
    }
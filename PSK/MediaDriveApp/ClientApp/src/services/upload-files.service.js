import { BlobClient } from "@azure/storage-blob";
import { callApi } from "../apiClient";

class UploadFilesService {
  startTransaction(file) {
    let data = {
      name: file.name,
      type: 0, //file.type, 0 - file, 1 - folder
      size: file.size,
    };

    return callApi("POST", (driveId) => `/api/drive/${driveId}/upload`, {data});
  }

  commitUpload(transactiond_id) {
    return callApi("PUT", (driveId) => `/api/drive/${driveId}/upload/${transactiond_id}`);
  }

  uploadFile(storageItem, file) {
    var blobClient = new BlobClient(storageItem.uploadUri);
    var blockClient = blobClient.getBlockBlobClient();
    return blockClient.uploadData(file);
  }
}

export default new UploadFilesService();

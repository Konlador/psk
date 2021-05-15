import http from "../http-common";
import { BlobClient } from "@azure/storage-blob";
const driveId = "982ecb26-309b-451a-973d-2d6f6e1b2e34";
const url_base = `/api/drive/${driveId}`;

class UploadFilesService {
  startTransaction(file) {
    let data = {
      name: file.name,
      type: 0, //file.type, 0 - file, 1 - folder
      size: file.size,
    };
    let axiosConfig = {
      headers: { "Content-Type": "application/json" },
    };
    console.log(file);
    return http.post(`${url_base}/upload`, data, axiosConfig);
  }

  commitUpload(transactiond_id) {
    return http.put(`${url_base}/upload/${transactiond_id}`);
  }

  uploadFile(storageItem, file) {
    var blobClient = new BlobClient(storageItem.uploadUri);
    var blockClient = blobClient.getBlockBlobClient();
    return blockClient.uploadData(file);
  }

  getFiles() {
    return http.get(`${url_base}/files`);
  }
}

export default new UploadFilesService();

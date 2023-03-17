const { BlobServiceClient } = require("@azure/storage-blob");
require("dotenv").config();

const blobService = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

module.exports = blobService;

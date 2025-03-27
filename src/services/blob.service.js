const { BlobServiceClient } = require('@azure/storage-blob');

class BlobService {
  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    this.containerClient = this.blobServiceClient.getContainerClient(
      process.env.AZURE_STORAGE_CONTAINER_NAME
    );
    this.initializeContainer();
  }

  async initializeContainer() {
    try {
      await this.containerClient.createIfNotExists();
      console.log('Azure Blob Storage container initialized successfully');
    } catch (error) {
      console.error('Error initializing Azure Blob Storage container:', error);
      throw error;
    }
  }

  async uploadImage(file, filename) {
    try {
      // Create blob client
      const blobClient = this.containerClient.getBlockBlobClient(filename);

      // Upload file
      await blobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype }
      });

      // Get URL with correct container name
      const url = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER_NAME}/${filename}`;
      return url;
    } catch (error) {
      console.error('Error uploading to blob storage:', error);
      throw error;
    }
  }

  async deleteImage(filename) {
    try {
      const blobClient = this.containerClient.getBlockBlobClient(filename);
      await blobClient.delete();
    } catch (error) {
      console.error('Error deleting from blob storage:', error);
      throw error;
    }
  }

  generateUniqueFileName(originalName) {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
  }
}

module.exports = new BlobService(); 
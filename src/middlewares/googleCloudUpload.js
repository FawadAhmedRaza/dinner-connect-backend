const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
// Initialize Google Cloud Storage
const credential = JSON.parse(
  Buffer.from(process.env.GOOGLE_CLOUD_SERVICE_KEY, 'base64').toString()
);
const storage = new Storage({
  credentials: {
    client_email: credential.client_email,
    private_key: credential.private_key, // replace \\n with actual newlines
  },
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
const bucket = storage.bucket(bucketName);

// Configure Multer
const multerStorage = multer({ storage: multer.memoryStorage() }); // Use memory storage for direct buffer access

const uploadFileToGCS = async (file, folder = '') => {
  try {
    const { buffer, originalname } = file; // Assume multer provides the file
    const fileName = `${folder}/${Date.now()}_${originalname}`; // Unique file name
    const fileUpload = bucket.file(fileName);

    const response = await fileUpload.save(buffer, {
      contentType: file.mimetype,
    });

    console.log(response);
    return `https://storage.googleapis.com/${bucketName}/${fileName}`; // Public URL of the file
  } catch (error) {
    console.log('error', error);
    throw 'Error uploading file to Google Cloud Storage';
  }
};

module.exports = { uploadFileToGCS, multerStorage };

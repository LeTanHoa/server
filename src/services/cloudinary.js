import { v2 as cloudinary } from 'cloudinary';

let isConfigured = false;

function ensureCloudinaryConfigured() {
  if (isConfigured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Thiếu cấu hình Cloudinary (CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET)');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  isConfigured = true;
}

export async function uploadAudioToCloudinary(localFilePath) {
  ensureCloudinaryConfigured();

  const folder = process.env.CLOUDINARY_AUDIO_FOLDER || 'spotify/audio';
  const uploaded = await cloudinary.uploader.upload(localFilePath, {
    resource_type: 'video',
    folder,
    use_filename: true,
    unique_filename: true,
  });

  return {
    secureUrl: uploaded.secure_url,
    publicId: uploaded.public_id,
  };
}

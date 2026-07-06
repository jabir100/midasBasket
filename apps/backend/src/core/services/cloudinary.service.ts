import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { env } from "../config/env.js";
import { logger } from "../logging/logger.js";

// Configure Cloudinary only if credentials are provided
if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
  logger.info("Cloudinary service initialized successfully");
} else {
  logger.warn(
    "Cloudinary credentials are not configured. File uploads will fall back to mock links."
  );
}

export type UploadResult = {
  url: string;
  publicId: string;
};

/**
 * Uploads an image file buffer to Cloudinary.
 * If credentials are not configured, falls back to returning a mock URL.
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string
): Promise<UploadResult> {
  const isConfigured = Boolean(
    env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
  );

  if (!isConfigured) {
    // Local development mock fallback
    const mockId = `mock_${Math.random().toString(36).substring(2, 11)}`;
    logger.info({ mockId }, "Cloudinary is unconfigured; generating mock upload link");
    return {
      url: `/images/homepage/placeholder.webp`,
      publicId: mockId,
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `midas-basket/${folder}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          logger.error({ error }, "Cloudinary upload failed");
          reject(new Error(error.message));
          return;
        }
        if (!result) {
          logger.error("Cloudinary upload did not return a result payload");
          reject(new Error("Cloudinary upload failed"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    const stream = Readable.from(fileBuffer);
    stream.pipe(uploadStream);
  });
}

/**
 * Deletes an image from Cloudinary using its public ID.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const isConfigured = Boolean(
    env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
  );

  if (!isConfigured || publicId.startsWith("mock_")) {
    logger.info({ publicId }, "Mock delete from Cloudinary");
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info({ publicId }, "Deleted asset from Cloudinary");
  } catch (error) {
    logger.error({ error, publicId }, "Failed to delete asset from Cloudinary");
  }
}

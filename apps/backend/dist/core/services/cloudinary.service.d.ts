export type UploadResult = {
    url: string;
    publicId: string;
};
/**
 * Uploads an image file buffer to Cloudinary.
 * If credentials are not configured, falls back to returning a mock URL.
 */
export declare function uploadToCloudinary(fileBuffer: Buffer, folder: string): Promise<UploadResult>;
/**
 * Deletes an image from Cloudinary using its public ID.
 */
export declare function deleteFromCloudinary(publicId: string): Promise<void>;
//# sourceMappingURL=cloudinary.service.d.ts.map
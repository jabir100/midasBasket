import multer from "multer";
import { AppError } from "../errors/app-error.js";

// Memory storage is used to preprocess buffers with sharp before uploading to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image/")) {
    return callback(
      new AppError({
        statusCode: 400,
        code: "INVALID_FILE_TYPE",
        message: "Only image files are allowed",
      })
    );
  }
  callback(null, true);
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

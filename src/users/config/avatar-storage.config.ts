import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

export const AVATAR_UPLOAD_DIR = join(process.cwd(), 'uploads', 'avatars');

export const avatarMulterOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      if (!fs.existsSync(AVATAR_UPLOAD_DIR)) {
        fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
      }
      callback(null, AVATAR_UPLOAD_DIR);
    },
    filename: (req, file, callback) => {
      const userId = req.params.id || 'user';
      const fileExt = extname(file.originalname).toLowerCase();
      const uniqueFilename = `avatar-${userId}-${Date.now()}${fileExt}`;
      callback(null, uniqueFilename);
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB Max
  },
  fileFilter: (req: any, file: any, callback: any) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|gif)$/)) {
      return callback(
        new BadRequestException('Only image files (jpg, jpeg, png, webp, gif) are allowed!'),
        false,
      );
    }
    callback(null, true);
  },
};

/**
 * Utility helper to safely delete an old avatar file from local disk.
 */
export function removeFileFromDisk(relativeOrAbsolutePath: string) {
  try {
    if (!relativeOrAbsolutePath) return;
    const cleanPath = relativeOrAbsolutePath.startsWith('/')
      ? relativeOrAbsolutePath.substring(1)
      : relativeOrAbsolutePath;
    const fullPath = join(process.cwd(), cleanPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error(`Failed to remove file from disk: ${relativeOrAbsolutePath}`, error);
  }
}

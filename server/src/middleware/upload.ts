import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { paths } from '../config/index.js';
import { BadRequestError } from '../lib/errors.js';

if (!fs.existsSync(paths.uploads)) {
  fs.mkdirSync(paths.uploads, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, paths.uploads),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  if (!file.mimetype.startsWith('image/')) {
    cb(new BadRequestError('Only image uploads are allowed'));
    return;
  }
  cb(null, true);
}

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');

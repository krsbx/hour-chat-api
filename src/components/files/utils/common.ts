import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import Firebase from '../../../shares/Firebase';
import { ROOT_PATH } from '../../../shares/constant';

export const fileStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, path.join(ROOT_PATH, 'tmp'));
  },
  filename(req, file, callback) {
    const fileNames = [uuidv4(), path.extname(file.originalname)];

    callback(null, fileNames.join('.'));
  },
});

export async function storageUpload(filePath: string) {
  const response = await Firebase.instance.storage.bucket().upload(filePath, {
    public: true,
  });

  return response;
}

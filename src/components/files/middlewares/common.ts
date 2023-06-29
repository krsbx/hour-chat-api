import _ from 'lodash';
import {
  createBadRequestResponse,
  createCodeStatus,
} from '@krsbx/response-formatter';
import asyncMw from 'express-asyncmw';
import multer from 'multer';
import convertSize from 'convert-size';
import { fileStorage, storageUpload } from '../utils/common';

export const uploadMw = asyncMw(async (req, res, next) => {
  multer({
    storage: fileStorage,
    limits: {
      fieldSize: convertSize('5 MB', 'B'),
    },
  }).array('file', 5)(req, res, next);
});

export const uploadToStorageMw = asyncMw(async (req, res) => {
  if (!req.files) return res.status(400).json(createBadRequestResponse());

  const responses = await Promise.all(
    _.map(req.files as Express.Multer.File[], async (file) => {
      const response = await storageUpload(file.path);

      return response[0].publicUrl();
    })
  );

  return res.status(200).json({
    ...createCodeStatus(200),
    data: responses,
  });
});

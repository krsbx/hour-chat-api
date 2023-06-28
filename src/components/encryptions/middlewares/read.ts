import asyncMw from 'express-asyncmw';
import { z } from 'zod';
import { createNotFoundResponse } from '@krsbx/response-formatter';
import schema from '../../../shares/schema';
import { getEncryptionByType } from '../events';
import { BaseEncryptionModel } from '../models/attributes';

export const getEncryptionMw = asyncMw<{
  reqBody: z.infer<(typeof schema.encryptions)['encryptionQuery']>;
  extends: {
    encryption: BaseEncryptionModel;
  };
}>(async (req, res, next) => {
  const encryption = await getEncryptionByType(req.body);

  if (!encryption) {
    return res.status(404).json(createNotFoundResponse('Encryption'));
  }

  req.encryption = encryption;

  return next();
});

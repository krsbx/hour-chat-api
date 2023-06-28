import { createResourceResponse } from '@krsbx/response-formatter';
import asyncMw from 'express-asyncmw';
import { BaseEncryptionModel } from '../models/attributes';
import { omit } from '../../../shares/common';

export const returnEncryptionMw = asyncMw<{
  extends: {
    encryption: BaseEncryptionModel;
  };
}>(async (req, res) => {
  const encryption = omit(req.encryption.dataValues, [
    'id',
    'type',
    'senderId',
    'receiverId',
    'createdAt',
    'updatedAt',
  ]);

  return res.status(200).json(createResourceResponse(req, encryption));
});

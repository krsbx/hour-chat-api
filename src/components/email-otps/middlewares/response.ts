import { createCodeStatus } from '@krsbx/response-formatter';
import asyncMw from 'express-asyncmw';

export const returnSuccessEmailOtpMw = asyncMw(async (req, res) => {
  return res.status(200).json(createCodeStatus(200));
});

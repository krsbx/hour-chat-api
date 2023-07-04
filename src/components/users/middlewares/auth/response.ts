import { createCodeStatus } from '@krsbx/response-formatter';
import asyncMw from 'express-asyncmw';

export const returnUserTokenMw = asyncMw<{
  extends: {
    token: string;
    firebaseToken: string;
  };
}>(async (req, res) => {
  return res.status(200).json({
    ...createCodeStatus(200),
    data: {
      token: req.token,
      firebaseToken: req.firebaseToken,
    },
  });
});

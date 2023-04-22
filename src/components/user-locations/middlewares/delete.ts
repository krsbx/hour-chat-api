import asyncMw from 'express-asyncmw';
import { createCodeStatus } from '@krsbx/response-formatter';
import { BaseUserLocationModel } from '../models/attributes';
import UserLocation from '../models';

export const deleteUserLocationMw = asyncMw<{
  extends: {
    userLocation: BaseUserLocationModel;
  };
}>(async (req, res) => {
  await UserLocation.instance.destroy({
    where: {
      id: req.userLocation.dataValues.id,
    },
  });

  return res.json(200).json({
    ...createCodeStatus(200),
    message: 'Your account location has been deleted successfully',
  });
});

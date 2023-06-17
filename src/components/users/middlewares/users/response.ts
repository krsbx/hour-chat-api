import _ from 'lodash';
import asyncMw from 'express-asyncmw';
import {
  createResourceResponse,
  createResourcesResponse,
} from '@krsbx/response-formatter';
import User from '../../models';
import { BaseUserModel } from '../../models/attributes';
import { BaseUserLocationModel } from '../../../user-locations/models/attributes';
import UserLocation from '../../../user-locations/models';

export const returnUserMw = asyncMw<{
  extends: {
    user: BaseUserModel;
  };
}>(async (req, res) => {
  const user = await User.instance.factory.modelToResource(req.user);

  return res.status(200).json(createResourceResponse(req, user));
});

export const returnUsersMw = asyncMw<{
  extends: {
    users: {
      rows: BaseUserModel[];
      count: number;
    };
  };
}>(async (req, res) => {
  const { count, rows } = req.users;

  return res.status(200).json(
    createResourcesResponse(req, {
      rows: await Promise.all(
        _.map(rows, User.instance.factory.modelToResource)
      ),
      count,
    })
  );
});

export const returnNearMeUsersMw = asyncMw<{
  extends: {
    users: {
      rows: (BaseUserLocationModel & { user?: BaseUserModel })[];
      count: number;
    };
  };
}>(async (req, res) => {
  const { rows, count } = req.users;

  return res.status(200).json(
    createResourcesResponse(req, {
      rows: await Promise.all(
        _.map(rows, (row) => ({
          ...UserLocation.instance.factory.modelToResource(row),
          user: row.user ? User.instance.factory.modelToResource(row.user) : {},
        }))
      ),
      count,
    })
  );
});

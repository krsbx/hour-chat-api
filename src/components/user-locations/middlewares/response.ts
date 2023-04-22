import _ from 'lodash';
import asyncMw from 'express-asyncmw';
import {
  createResourceResponse,
  createResourcesResponse,
} from '@krsbx/response-formatter';
import UserLocation from '../models';
import { BaseUserLocationModel } from '../models/attributes';

export const returnUserLocationMw = asyncMw<{
  extends: {
    userLocation: BaseUserLocationModel;
  };
}>(async (req, res) => {
  const user = await UserLocation.instance.factory.modelToResource(
    req.userLocation
  );

  return res.status(200).json(createResourceResponse(req, user));
});

export const returnUserLocationsMw = asyncMw<{
  extends: {
    userLocations: {
      rows: BaseUserLocationModel[];
      count: number;
    };
  };
}>(async (req, res) => {
  const { count, rows } = req.userLocations;

  return res.status(200).json(
    createResourcesResponse(req, {
      rows: await Promise.all(
        _.map(rows, UserLocation.instance.factory.modelToResource)
      ),
      count,
    })
  );
});

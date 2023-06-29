import asyncMw from 'express-asyncmw';
import {
  createResourceResponse,
  createResourcesResponse,
} from '@krsbx/response-formatter';
import { BaseGroupModel } from '../models/attributes';

export const returnGroupMw = asyncMw<{
  extends: {
    group: BaseGroupModel;
  };
}>(async (req, res) => {
  return res.status(200).json(createResourceResponse(req, req.group));
});

export const returnGroupsMw = asyncMw<{
  extends: {
    groups: {
      rows: BaseGroupModel[];
      count: number;
    };
  };
}>(async (req, res) => {
  return res.status(200).json(createResourcesResponse(req, req.groups));
});

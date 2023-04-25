import { Op, Sequelize } from 'sequelize';
import asyncMw from 'express-asyncmw';
import { createNotFoundResponse } from '@krsbx/response-formatter';
import User from '../../models';
import { BaseUserModel, UserAttribute } from '../../models/attributes';
import UserLocation from '../../../user-locations/models';
import { UserLocationModel } from '../../../user-locations/models/attributes';

export const getUserMw = asyncMw<{
  params: {
    id: string;
  };
  extends: {
    user: BaseUserModel;
  };
}>(async (req, res, next) => {
  const user = await User.instance.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    return res
      .json(400)
      .json(createNotFoundResponse(`User with id ${req.params.id}`));
  }

  req.user = user;

  return next();
});

export const getUsersMw = asyncMw<{
  extends: {
    users: {
      rows: BaseUserModel[];
      count: number;
    };
  };
}>(async (req, res, next) => {
  const users = await User.instance.factory.findAll(
    {},
    req.filterQueryParams,
    req.query
  );

  req.users = users;

  return next();
});

export const getNearMeUsersMw = asyncMw<{
  extends: {
    users: {
      rows: BaseUserModel[];
      count: number;
    };
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res, next) => {
  const userLocation = await UserLocation.instance.findOne({
    where: {
      userId: req.currentUser.id,
    },
  });

  if (!userLocation) {
    req.users = {
      count: 0,
      rows: [],
    };

    return next();
  }

  const [lng, lat] = userLocation.dataValues.location.coordinates;

  const sql = `ST_DWithin(
    Geography("location"),
    Geography(ST_MakePoint(${lng},${lat})),
    ${+(req.query?.radius ?? 50_000)}
    )`;

  const location = Sequelize.literal(sql);

  delete req.query?.radius;

  const users = await UserLocation.instance.factory.findAll(
    {
      where: {
        location,
        userId: {
          [Op.not]: req.currentUser.id,
        },
      },
      include: ['user'],
      order: [['userId', 'ASC']],
    },
    req.filterQueryParams,
    req.query
  );

  req.users = {
    count: users.count,
    rows: (
      users.rows as unknown as (UserLocationModel & { user: BaseUserModel })[]
    ).map(({ user }) => user),
  };

  return next();
});

import asyncMw from 'express-asyncmw';
import SequelizeFQP from '@krsbx/sequelize-fqp';

export const queryParserMw = asyncMw<{
  reqQuery: {
    filters?: string;
  };
  extends: {
    filterQueryParams: NonNullable<unknown>;
  };
}>(async (req, res, next) => {
  req.filterQueryParams = req.query.filters
    ? SequelizeFQP(req.query.filters)
    : {};
  delete req.query.filters;

  return next();
});

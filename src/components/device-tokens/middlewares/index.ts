import * as createMw from './create';
import * as readMw from './read';
import * as deleteMw from './delete';
import * as commonMw from './common';
import * as responseMw from './response';

export default {
  create: createMw,
  read: readMw,
  delete: deleteMw,
  common: commonMw,
  response: responseMw,
};

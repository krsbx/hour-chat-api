import * as commonMw from './common';
import * as createMw from './create';
import * as readMw from './read';
import * as updateMw from './update';
import * as deleteMw from './delete';
import * as responseMw from './response';

export default {
  common: commonMw,
  create: createMw,
  read: readMw,
  update: updateMw,
  delete: deleteMw,
  response: responseMw,
};

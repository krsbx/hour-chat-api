import * as createMw from './create';
import * as updateMw from './update';
import * as readMw from './read';
import * as deleteMw from './delete';
import * as commonMw from './common';
import * as responseMw from './response';

export default {
  create: createMw,
  update: updateMw,
  read: readMw,
  delete: deleteMw,
  common: commonMw,
  response: responseMw,
};

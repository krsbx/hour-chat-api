import * as createMw from './create';
import * as readMw from './read';
import * as updateMw from './update';
import * as deleteMw from './delete';
import * as commonMw from './common';

export default {
  create: createMw,
  read: readMw,
  update: updateMw,
  delete: deleteMw,
  common: commonMw,
};

import express from 'express';
import db from './models';
import root from './shares/root';
import { prepareFileUpload, validateEnv } from './shares/common';
import ENVIRONMENT from './config/environment';

const PORT = +(ENVIRONMENT.PORT ?? 3001);

validateEnv();
prepareFileUpload();

db.sequelize.sync();

const app = express();

app.listen(PORT, () => {
  console.log(`Sever are running @ ${PORT}`);
});

root(app);

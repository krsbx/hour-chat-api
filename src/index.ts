import { config as dotenvConfig } from 'dotenv';
import express from 'express';
import db from './models';
import root from './shares/root';
import { validateEnv } from './shares/common';

dotenvConfig();

const PORT = +(process.env.PORT ?? 3001);

validateEnv();

db.sequelize.sync();

const app = express();

app.listen(PORT, () => {
  console.log(`Sever are running @ ${PORT}`);
});

root(app);

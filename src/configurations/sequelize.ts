import { Sequelize } from 'sequelize';
import { environment } from './environment';

export const sequelize = new Sequelize(
  environment.DB_NAME,
  environment.DB_USERNAME,
  environment.DB_PASSWORD,
  {
    host: environment.DB_HOST,
    dialect: 'mysql',
    logging: false,
    port: +environment.DB_PORT,
  },
);

import { Sequelize } from 'sequelize'
import { Env } from '../shared/constants/env'

export const sequelize = new Sequelize(Env.DB_NAME, Env.DB_USERNAME, Env.DB_PASSWORD, {
  host: Env.DB_HOST,
  dialect: 'mysql',
  logging: false,
  port: +Env.DB_PORT
})

// require('dotenv').config()
import { config } from 'dotenv'
config()
import * as fs from 'fs'
import * as path from 'path'
import {
  SecretsManagerClient,
  GetSecretValueCommand
} from '@aws-sdk/client-secrets-manager'
import { MULTITYPE } from '../shared/constants/dataType'
import { ICommon } from '../interfaces/common/ICommon'

const loadSecretAndBuildFile = async () => {
  try {
    let env = {
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME,
      DB_DIALECT: process.env.DB_DIALECT,
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
      SWAGGER_UNAME: process.env.SWAGGER_UNAME,
      SWAGGER_PASSWORD: process.env.SWAGGER_PASSWORD
    }

    Object.keys(env)?.forEach(key => {
      if(env[key] === undefined || env[key] === null) throw new Error(`please add ${key} in env `)
    })

    if (process.env.IS_SECRET) {

      const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION })

      let cred: MULTITYPE = ''
      let secretName
      if (process.env.NODE_ENV === 'development') {
        secretName = 'MDG-CUSTOMER-MS-DEV-SECRET'
      } else if (process.env.NODE_ENV === 'production') {
        secretName = 'MDG-CUSTOMER-MS-PROD-SECRET'
      }

      const command = new GetSecretValueCommand({
        SecretId: secretName
      })
      const credentialObj: ICommon = {}
      const response: ICommon = await secretsManager.send(command)
      if (response.SecretString !== undefined) {
        cred = JSON.parse(response.SecretString)
      } else {
        const buff = Buffer.from(response.SecretBinary, 'base64')
        cred = buff.toString('ascii')
      }
      cred = [cred]
      if (cred) {
        cred.forEach((list: MULTITYPE) => {
          Object.keys(list).forEach((key) => {
            credentialObj[key] = list[key]
          })
        })
      }

      env = { ...env, ...credentialObj }
    }
    const config_json: ICommon = {
      development: {
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        host: env.DB_HOST,
        dialect: env.DB_DIALECT,
        seederStorage: 'json',
        seederStoragePath: 'sequelizeMeta.json'
      }
    }
    let json = JSON.stringify(env, null, 2)
    json.replace(/\\"/g, '\uFFFF')
    // eslint-disable-next-line no-useless-escape
    json = json.replace(/"([^"]+)":/g, '$1:').replace(/\uFFFF/g, '\\\"')
    json = json.replace(/"/g, '\'')

    fs.writeFileSync(path.join(__dirname, '../constants/env.ts'), `export const Env = ${json}\n`)
    fs.writeFileSync(path.join(__dirname, '../../database/config/config.json'), JSON.stringify(config_json))
  } catch (err) {
    console.log(err)
  }
}

loadSecretAndBuildFile()

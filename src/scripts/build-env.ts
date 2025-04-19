require('dotenv').config()
import * as fs from 'fs'
import * as path from 'path'
import {
  SecretsManagerClient,
  GetSecretValueCommand
} from '@aws-sdk/client-secrets-manager'
import { ICommon } from '../interfaces/common/ICommon'
import { MULTITYPE } from '../constants/dataType'

const loadSecretAndBuildFile = async () => {
  try {

    if (process.env.IS_SECRET) {

      const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION })

      let cred: MULTITYPE = ''
      let secretName
      if (process.env.NODE_ENV === 'development') {
        secretName = 'NEST-DEV-SECRET'
      } else if (process.env.NODE_ENV === 'production') {
        secretName = 'NEST-PROD-SECRET'
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

    }
    const config_json: ICommon = {
      development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        seederStorage: 'json',
        seederStoragePath: 'sequelizeMeta.json'
      }
    }
    fs.writeFileSync(path.join(__dirname, '../../database/config/config.json'), JSON.stringify(config_json))
  } catch (err) {
    console.log(err)
  }
}

loadSecretAndBuildFile()

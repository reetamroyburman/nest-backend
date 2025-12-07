/* eslint-disable no-unused-vars */
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import { HttpStatus, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Env } from './shared/constants/env'
// import MessageBroker from './helper/rabbitMQ/messageQ'

const apiDocumentationCredentials = {
  name: Env.SWAGGER_UNAME,
  pass: Env.SWAGGER_PASSWORD
}

async function bootstrap () {
  const app = await NestFactory.create(AppModule)

  // Add global prefix for all controllers
  app.setGlobalPrefix('api')

  app.enableCors()
  app.use(helmet())

  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: false }))

  // Swagger setup with authentication
  app.use('/api/documentation', (req, res, next) => {
    const parseAuthHeader = (input: string): { name: string; pass: string } => {
      const [, encodedPart] = input.split(' ')
      const buff = Buffer.from(encodedPart, 'base64')
      const text = buff.toString('ascii')
      const [name, pass] = text.split(':')
      return { name, pass }
    }

    const unauthorizedResponse = (): void => {
      res.status(HttpStatus.UNAUTHORIZED).setHeader('WWW-Authenticate', 'Basic')
      next()
    }

    if (!req.headers.authorization) {
      return unauthorizedResponse()
    }

    const credentials = parseAuthHeader(req.headers.authorization)

    if (credentials.name !== apiDocumentationCredentials.name || credentials.pass !== apiDocumentationCredentials.pass) {
      return unauthorizedResponse()
    }

    next()
  })

  const config = new DocumentBuilder()
    .setTitle('MDG Customer MS')
    .setDescription('A REST API using Nestjs for MDG Customer MS')
    .addApiKey(
      { type: 'apiKey', name: 'Authorization', in: 'header' },
      'Authorization'
    )
    .addApiKey(
      { type: 'apiKey', name: 'workspace-path', in: 'header' },
      'workspace-path'
    )
    .addApiKey(
      { type: 'apiKey', name: 'static-token', in: 'header' },
      'static-token'
    )
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/documentation', app, document)
  // MessageBroker.getInstance().init()
  await app.listen(Env.PORT || 9004)
  console.log(`Server running at http://127.0.0.1:${Env.PORT || 9004}. Check swagger at http://127.0.0.1:${Env.PORT || 9004}/api/documentation`)
}
bootstrap()

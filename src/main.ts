import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { HttpStatus } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { environment } from "./configurations/environment";
import * as dotenv from 'dotenv';

dotenv.config()

const apiDocumentationCredentials = {
  username: process.env.SWAGGER_USERNAME,
  password: process.env.SWAGGER_PASSWORD
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  app.enableCors();
  app.use(helmet());

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
    console.log('credentials>>>>>', credentials)

    if (credentials.name !== apiDocumentationCredentials.username || credentials.pass !== apiDocumentationCredentials.password) {
      return unauthorizedResponse()
    }

    next()
  })

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest Backend')
    .setDescription('Backend with nestJS')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/documentation', app, document)
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on http://127.0.0.1:${+environment.PORT || 9000}. check Swagger at http://127.0.0.1:${+environment.PORT || 9000}/api/documentation`)
};

bootstrap();

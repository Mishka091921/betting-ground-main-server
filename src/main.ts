import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
// PrismaExceptionFilter removed - using AllExceptionsFilter from lib package
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RolesGuard, AppEnvironment } from '@betting-ground/prisma-lib';
import { ThrottlerGuard } from '@nestjs/throttler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  //LOGGERS
  const logger = new Logger('Bootstrap');
  logger.log('App starting...');

  //VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //SWAGGER
  if (process.env.NODE_ENV !== AppEnvironment.PRODUCTION) {
    const config = new DocumentBuilder()
      .setTitle('My API')
      .setDescription('API description')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          in: 'header',
        },
        'Bearer',
      )
      .setVersion('3.0')
      .addServer('/v3')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? (process.env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim())
      : ['*'];

  //CORS
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, origin || '*');
    },
    credentials: true,
  });

  //BigInt serial
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  //OTHERS..
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));
  app.use(cookieParser());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '3',
  });

  await app.listen(process.env.PORT ?? 3131, '0.0.0.0');
  logger.log(`App running on ${await app.getUrl()}`);
}
bootstrap();

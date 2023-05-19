import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      //transform: true
      whitelist: true,
      forbidNonWhitelisted: true
    })),
    app.use(
      session({
        secret: 'my-secret',
        resave: true,
        saveUninitialized: false,
        cookie: {
          maxAge: 7200000
        }
      }),
    );
  app.enableCors();
  await app.listen(8080);
}
bootstrap();

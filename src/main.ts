import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const server = await NestFactory.create(AppModule, { cors: true });

  /* Version API */
  server.setGlobalPrefix('api');
  server.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1"
  });

  /* Validation */
  server.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await server.listen(Number(process.env.PORT));
}
bootstrap();

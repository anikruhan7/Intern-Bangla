import { setDefaultResultOrder } from 'dns';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

// This host's network has broken/unreliable IPv6 routing to at least Gmail's
// SMTP servers (observed ENETUNREACH and connection timeouts connecting to
// their IPv6 addresses) - Node resolves dual-stack hosts to IPv6 first by
// default, so outbound SMTP kept intermittently failing outright instead of
// falling back to the working IPv4 route. Forcing IPv4-first resolution
// avoids the broken path entirely.
setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());

  const corsOrigins = (
    config.get<string>('CORS_ORIGINS') ?? 'http://localhost:3001'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const globalPrefix = config.get<string>('API_GLOBAL_PREFIX') ?? 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (config.get<string>('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Intern Bangla API')
      .setDescription('REST API for the Intern Bangla platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
  }

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
}
void bootstrap();

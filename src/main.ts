import { setDefaultResultOrder } from 'dns';
import { setDefaultAutoSelectFamily } from 'net';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

// This host's network has broken/unreliable IPv6 routing to at least Gmail's
// SMTP servers (observed ENETUNREACH and connection timeouts connecting to
// their IPv6 addresses). Setting the DNS result order alone wasn't enough -
// Node's "Happy Eyeballs" (RFC 8305) autoSelectFamily still raced an IPv6
// attempt in parallel even with IPv4 preferred first, and that IPv6 attempt
// was the one failing. Disabling autoSelectFamily makes net.connect() use a
// single attempt with the (now IPv4-first) dns.lookup() order instead,
// avoiding the broken IPv6 path entirely.
setDefaultResultOrder('ipv4first');
if (typeof setDefaultAutoSelectFamily === 'function') {
  setDefaultAutoSelectFamily(false);
}

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

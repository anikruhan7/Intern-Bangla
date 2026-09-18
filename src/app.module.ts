import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/users.module';
import { ResumeModule } from './resume/resume.module';
import { InternshipModule } from './internship/internship.module';
import { CompanyModule } from './company/company.module';
import { ApplicationModule } from './application/application.module';
import { AuthModule } from './auth/auth.module';
import { InterviewsModule } from './interview/interview.module';
import { MailModule } from './mail/mail.module';
import { CourseModule } from './course/course.module';
import { EventModule } from './event/event.module';
import { PaymentModule } from './payment/payment.module';
import { CertificateModule } from './certificate/certificate.module';
import { CampusAmbassadorModule } from './campus-ambassador/campus-ambassador.module';
import { ComplaintModule } from './complaint/complaint.module';
import { TommyModule } from './tommy/tommy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // A single connection string (e.g. from Neon, Supabase, Render
        // Postgres) takes priority when set - simpler to configure on a
        // host than five separate DB_* vars. Falls back to those for local
        // Docker Postgres, which has no TLS.
        const databaseUrl = config.get<string>('DATABASE_URL');

        const base = databaseUrl
          ? { url: databaseUrl, ssl: { rejectUnauthorized: false } }
          : {
              host: config.getOrThrow<string>('DB_HOST'),
              port: config.get<number>('DB_PORT', 5432),
              username: config.getOrThrow<string>('DB_USERNAME'),
              password: config.getOrThrow<string>('DB_PASSWORD'),
              database: config.getOrThrow<string>('DB_NAME'),
            };

        return {
          type: 'postgres' as const,
          ...base,
          autoLoadEntities: true,
          // Never enable schema auto-sync in production - use `npm run
          // db:sync` once instead (see scripts/sync-schema.ts).
          synchronize:
            config.get<string>('NODE_ENV') !== 'production' &&
            config.get<string>('DB_SYNCHRONIZE') === 'true',
        };
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL_MS ?? '60000', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT ?? '20', 10),
      },
    ]),
    UsersModule,
    ResumeModule,
    InternshipModule,
    CompanyModule,
    ApplicationModule,
    AuthModule,
    InterviewsModule,
    MailModule,
    CourseModule,
    EventModule,
    PaymentModule,
    CertificateModule,
    CampusAmbassadorModule,
    ComplaintModule,
    TommyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

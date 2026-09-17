import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('MAIL_HOST');
        const user = config.get<string>('MAIL_USER');
        const pass = config.get<string>('MAIL_PASSWORD');

        // No SMTP credentials configured yet (e.g. fresh local setup): fall
        // back to a JSON transport so the app still boots and emails are
        // just logged instead of sent, rather than crashing on startup.
        const transport =
          host && user && pass
            ? {
                host,
                port: config.get<number>('MAIL_PORT', 465),
                secure: config.get<number>('MAIL_PORT', 465) === 465,
                auth: { user, pass },
              }
            : { jsonTransport: true as const };

        return {
          transport,
          defaults: {
            from: config.get<string>('MAIL_FROM', '"Intern Bangla" <no-reply@internbangla.com>'),
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

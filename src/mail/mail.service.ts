import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendPasswordResetOtp(userEmail: string, userName: string, otp: string) {
    // Dev visibility: if no real SMTP is configured (see MailModule), the
    // mailer falls back to a JSON transport that never actually delivers
    // this, so log the code too - otherwise there's no way to get it.
    this.logger.log(`Password reset OTP for ${userEmail}: ${otp}`);
    await this.mailerService.sendMail({
      to: userEmail,
      subject: `${otp} is your Intern Bangla password reset code`,
      html: `
        <h3>Hi ${userName},</h3>
        <p>We received a request to reset your Intern Bangla password. Enter this code to continue - it expires in 1 minute.</p>
        <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px;">${otp}</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
  }

  async sendEmailChangeOtp(newEmail: string, userName: string, otp: string) {
    this.logger.log(`Email change OTP for ${newEmail}: ${otp}`);
    await this.mailerService.sendMail({
      to: newEmail,
      subject: `${otp} is your Intern Bangla verification code`,
      html: `
        <h3>Hi ${userName},</h3>
        <p>Someone requested to change the email on an Intern Bangla account to this address. Enter this code in your account settings to confirm - it expires in 1 minute.</p>
        <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px;">${otp}</p>
        <p>If this wasn't you, you can safely ignore this email - your address won't be used.</p>
      `,
    });
  }

  async sendProfileCreationEmail(userEmail: string, userName: string) {
    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Welcome to Intern Bangla!',
      html: `
        <h3>Hey ${userName},</h3>
        <p>Welcome to Intern Bangla! Your profile has been successfully created.</p>
        <p>You can now start setting up your resume and applying for internships.</p>
      `,
    });
  }

  async sendProfileUpdateEmail(userEmail: string, userName: string) {
    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Intern Bangla - Your Profile Has Been Updated',
      html: `
        <h3>Hello ${userName},</h3>
        <p>Your Intern Bangla profile information has been successfully updated.</p>
        <p>For any support, please contact our team immediately.</p>
      `,
    });
  }
}

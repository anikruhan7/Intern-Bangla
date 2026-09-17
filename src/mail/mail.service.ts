import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

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

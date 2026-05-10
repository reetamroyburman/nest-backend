import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {

  private transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  async sendAccountLockedEmail(
    email: string,
    firstName: string,
  ) {

    await this.transporter.sendMail({
      from: process.env.MAIL_USER,

      to: email,

      subject: 'Account Locked Alert',

      html: `
        <h2>Hello ${firstName},</h2>

        <p>
          Your account has been temporarily locked due to
          multiple failed login attempts.
        </p>

        <p>
          Please try again after 30 minutes.
        </p>

        <p>
          If this was not you, please reset your password immediately.
        </p>
      `,
    });
  }
}
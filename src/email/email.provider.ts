// src/email/email.provider.ts
import * as nodemailer from 'nodemailer';

export const emailTransporterProvider = {
  provide: 'EMAIL_TRANSPORTER',
  useFactory: () => {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  },
};

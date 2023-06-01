import { config as dotenvConfig } from 'dotenv';
import nodemailer from 'nodemailer';

dotenvConfig();

export function createTransport() {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  return transporter;
}

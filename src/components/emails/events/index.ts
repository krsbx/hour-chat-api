import { BaseEmailModel } from '../models/attributes';
import { createTransport } from '../utils/common';

export function sendEmail(email: BaseEmailModel) {
  const transporter = createTransport();

  const mailOptions = {
    from: email.dataValues.sender,
    to: email.dataValues.receiver,
    subject: email.dataValues.subject,
    text: email.dataValues.content,
  };

  return transporter.sendMail(mailOptions);
}

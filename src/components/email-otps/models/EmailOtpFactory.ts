import { EmailOtpModel } from './attributes';

class EmailOtpFactory {
  private static _instance: EmailOtpModel;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static get instance() {
    return EmailOtpFactory._instance;
  }

  public static init(model: EmailOtpModel) {
    EmailOtpFactory._instance = model;

    return model;
  }
}

export default EmailOtpFactory;

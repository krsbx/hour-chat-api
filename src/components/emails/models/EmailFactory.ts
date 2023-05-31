import { EmailModel } from './attributes';

class EmailFactory {
  private static _instance: EmailModel;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static get instance() {
    return EmailFactory._instance;
  }

  public static init(model: EmailModel) {
    EmailFactory._instance = model;

    return model;
  }
}

export default EmailFactory;

import { EncryptionModel } from './attributes';

class EncryptionFactory {
  private static _instance: EncryptionModel;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static get instance() {
    return this._instance;
  }

  public static init(model: EncryptionModel) {
    EncryptionFactory._instance = model;

    return model;
  }
}

export default EncryptionFactory;

import { DeviceTokenModel } from './attributes';

class DeviceTokenFactory {
  private static _instance: DeviceTokenModel;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static get instance() {
    return DeviceTokenFactory._instance;
  }

  public static init(model: DeviceTokenModel) {
    DeviceTokenFactory._instance = model;

    return model;
  }
}

export default DeviceTokenFactory;

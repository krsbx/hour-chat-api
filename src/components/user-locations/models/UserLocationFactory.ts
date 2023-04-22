import { UserLocationModel } from './attributes';

class UserLocationFactory {
  private static _instance: UserLocationModel;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static get instance() {
    return UserLocationFactory._instance;
  }

  public static init(model: UserLocationModel) {
    UserLocationFactory._instance = model;

    return model;
  }
}

export default UserLocationFactory;

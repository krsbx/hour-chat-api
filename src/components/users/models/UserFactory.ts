import { UserModel } from './attributes';

class UserFactory {
  private static _instance: UserModel;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static get instance() {
    return UserFactory._instance;
  }

  public static init(model: UserModel) {
    UserFactory._instance = model;

    return model;
  }
}

export default UserFactory;

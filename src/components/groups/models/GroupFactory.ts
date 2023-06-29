import { GroupModel } from './attributes';

class GroupFactory {
  private static _instance: GroupModel;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static get instance() {
    return this._instance;
  }

  public static init(model: GroupModel) {
    GroupFactory._instance = model;

    return model;
  }
}

export default GroupFactory;

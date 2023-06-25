import { StoryModel } from './attributes';

class StoryFactory {
  private static _instance: StoryModel;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static get instance() {
    return this._instance;
  }

  public static init(model: StoryModel) {
    StoryFactory._instance = model;

    return model;
  }
}

export default StoryFactory;

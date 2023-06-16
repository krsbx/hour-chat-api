import { Model, ModelStatic } from 'sequelize';

declare global {
  type CreateOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type AnyRecord = Record<any, any>;

  type KeyOf<T> = keyof T;
  type ValueOf<T> = T[keyof T];

  type UnknownObject = NonNullable<unknown>;
  type UnknownModel = Model<UnknownObject, UnknownObject>;
  type UnknownStaticModel = ModelStatic<UnknownModel>;
}

export {};

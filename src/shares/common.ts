import _ from 'lodash';

export function castTo<T>(obj: unknown) {
  return obj as T;
}

export function omit<
  TObj extends NonNullable<unknown>,
  TKey extends keyof TObj
>(obj: TObj, key: TKey[]) {
  return _.omit(obj, key);
}

export function pick<
  TObj extends NonNullable<unknown>,
  TKey extends keyof TObj
>(obj: TObj, key: TKey[]) {
  return _.pick(obj, key);
}

export function hasOwnProperty<
  X extends NonNullable<object>,
  Y extends PropertyKey
>(obj: X, property: Y): obj is X & Record<Y, unknown> {
  // eslint-disable-next-line no-prototype-builtins
  return obj.hasOwnProperty(property);
}

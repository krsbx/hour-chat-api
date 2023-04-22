export type CreateOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type AnyRecord = Record<any, any>;

declare global {
  type CreateOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

  type AnyRecord = Record<any, any>;
}

export {};

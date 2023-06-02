import { config as dotenvConfig } from 'dotenv';
import _ from 'lodash';
import { Worker } from 'worker_threads';
import { ENV_NAMES } from './constant';

dotenvConfig();

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

export function validateEnv() {
  const fields = _.reduce(
    ENV_NAMES,
    (prev, curr) => {
      if (!_.isEmpty(process.env[curr])) return prev;

      prev.push(curr);

      return prev;
    },
    [] as unknown[]
  );

  if (!fields.length) return;

  const field = fields.join(', ');

  throw Error(`Please update the env in fields : ${field}`);
}

export function runWorker<T>(
  str: string,
  workerData: unknown,
  callback?: ((result: T) => void) | ((result: T) => Promise<void>)
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const worker = new Worker(str, {
      workerData,
    });

    worker.on('message', callback ?? resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

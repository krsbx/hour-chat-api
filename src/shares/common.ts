import { config as dotenvConfig } from 'dotenv';
import _ from 'lodash';
import { Worker } from 'worker_threads';
import { BuildOptions, CreationAttributes } from 'sequelize';
import db from '../models';
import { ENV_NAMES } from './constant';
import { MODEL_NAME } from './models';

dotenvConfig();

export function castTo<T>(obj: unknown) {
  return obj as T;
}

export function omit<TObj extends UnknownObject, TKey extends keyof TObj>(
  obj: TObj,
  key: TKey[]
) {
  return _.omit(obj, key);
}

export function pick<TObj extends UnknownObject, TKey extends keyof TObj>(
  obj: TObj,
  key: TKey[]
) {
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
    [] as string[]
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

export function buildModel<
  T extends ValueOf<typeof MODEL_NAME>,
  U extends HourChat.Models.ModelStatic[T],
  V extends HourChat.Models.BaseModel[T]
>(modelName: T, attribute?: CreationAttributes<V>, options?: BuildOptions) {
  const model = db[modelName] as unknown as U;

  return (model as unknown as UnknownStaticModel).build(
    attribute,
    options
  ) as V;
}

import { config as dotenvConfig } from 'dotenv';
import jwtToken from 'jsonwebtoken';
import _ from 'lodash';

dotenvConfig();

const jwtSecret = _.get(process.env, 'JWT_SECRET', '');

export function signAccessToken<TPayload extends NonNullable<unknown>>(
  payload: TPayload,
  always = false
) {
  const options: jwtToken.SignOptions = {};

  if (!always) options.expiresIn = '3h';

  return jwtToken.sign(payload, jwtSecret, options);
}

export function verifyAccessToken<
  TResult extends NonNullable<unknown> = NonNullable<unknown>
>(token: string) {
  return new Promise<TResult & jwtToken.JwtPayload>(function (resolve, reject) {
    jwtToken.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        reject(err);
      }

      resolve(decoded as TResult & jwtToken.JwtPayload);
    });
  });
}

import bcrypt from 'bcrypt';
import ENVIRONMENT from '../../../config/environment';

const SALT_ROUND = +ENVIRONMENT.SALT_ROUND;

export async function hashText(text: string) {
  const salt = await bcrypt.genSalt(SALT_ROUND);

  return bcrypt.hash(text, salt);
}

export async function compareText({
  original,
  text,
}: {
  text: string;
  original: string;
}) {
  const result = await bcrypt.compare(text, original);

  return result;
}

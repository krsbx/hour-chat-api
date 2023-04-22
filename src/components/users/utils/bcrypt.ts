import bcrypt from 'bcrypt';
import _ from 'lodash';

const SALT_ROUND = _.toNumber(_.get(process.env, 'SALT', 10));

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

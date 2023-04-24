import aesjs from 'aes-js';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

function encrypt(payload: { text: string; key?: number[]; iv?: number[] }) {
  const key = payload.key
    ? payload.key
    : JSON.parse(process.env.ENCRYPT_KEY ?? '[]');
  const iv = payload.key
    ? payload.key
    : JSON.parse(process.env.ENCRYPT_IV ?? '[]');

  const textBytes = aesjs.utils.utf8.toBytes(payload.text);

  // eslint-disable-next-line new-cap
  const aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
  const encryptedBytes = aesOfb.encrypt(textBytes);

  return aesjs.utils.hex.fromBytes(encryptedBytes);
}

function decrypt(payload: { text: string; key?: number[]; iv?: number[] }) {
  const key = payload.key
    ? payload.key
    : JSON.parse(process.env.ENCRYPT_KEY ?? '[]');
  const iv = payload.key
    ? payload.key
    : JSON.parse(process.env.ENCRYPT_IV ?? '[]');

  const encryptedBytes = aesjs.utils.hex.toBytes(payload.text);

  // eslint-disable-next-line new-cap
  const aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
  const decryptedBytes = aesOfb.decrypt(encryptedBytes);

  return aesjs.utils.utf8.fromBytes(decryptedBytes);
}

export default { encrypt, decrypt };

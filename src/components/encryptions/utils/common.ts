import _ from 'lodash';
import aesjs from 'aes-js';

export function createRandomArray(size: number, offset = 0) {
  const arr = Array(size)
    .fill(0)
    .map(() => _.random(1 + offset, 15 + offset, false));

  return arr;
}

export function createKeyIv() {
  return {
    key: createRandomArray(16),
    iv: createRandomArray(16, 16),
  };
}

export function encryptText(
  text: string,
  config: { key: number[]; iv: number[] }
) {
  const textBytes = aesjs.utils.utf8.toBytes(text);

  // eslint-disable-next-line new-cap
  const aesOfb = new aesjs.ModeOfOperation.ofb(config.key, config.iv);
  const encryptedBytes = aesOfb.encrypt(textBytes);

  return aesjs.utils.hex.fromBytes(encryptedBytes);
}

export function decryptText(
  text: string,
  config: { key: number[]; iv: number[] }
) {
  const encryptedBytes = aesjs.utils.hex.toBytes(text);

  // eslint-disable-next-line new-cap
  const aesOfb = new aesjs.ModeOfOperation.ofb(config.key, config.iv);
  const decryptedBytes = aesOfb.decrypt(encryptedBytes);

  return aesjs.utils.utf8.fromBytes(decryptedBytes);
}

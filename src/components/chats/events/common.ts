import _ from 'lodash';
import Firebase from '../../../shares/Firebase';

export async function getEncryptionConfigFromChat(path: string) {
  const { firestore } = Firebase.instance;

  const doc = await firestore.doc(path).get();
  const data = doc.data();

  if (!data || !data.version) return;

  return data.version as string;
}

export async function getLastEncryptionConfigVersion() {
  await Firebase.instance.getEncryptionConfig();

  return _.map(
    Firebase.instance.encryptionConfig,
    // eslint-disable-next-line no-shadow
    (_, key) => key
  ).pop() as string;
}

export async function getChatEncryptionConfig(path: string) {
  const version = await getEncryptionConfigFromChat(path);

  if (version) return version;

  return getLastEncryptionConfigVersion();
}

export function getEncryptionConfig(version: string) {
  const config = Firebase.instance.encryptionConfig;

  return {
    key: config?.[+version]?.ENCRYPT_KEY,
    iv: config?.[+version]?.ENCRYPT_IV,
  };
}

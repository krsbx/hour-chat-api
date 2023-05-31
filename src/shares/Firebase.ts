import path from 'path';
import admin from 'firebase-admin';
import { Query } from 'firebase-admin/firestore';
import { ASSETS_PATH } from './constant';

class Firebase {
  // eslint-disable-next-line no-use-before-define
  private static _instance: Firebase;
  private _firebase: admin.app.App;
  private _firestore: admin.firestore.Firestore;
  private _remoteConfig: admin.remoteConfig.RemoteConfig;
  private _encryptionConfig: HourChat.Encryption.EncryptionConfig;

  constructor() {
    this._firebase = admin.initializeApp({
      credential: admin.credential.cert(
        require(path.resolve(ASSETS_PATH, 'firebase-service-account.json'))
      ),
    });
    this._firestore = this.firebase.firestore();
    this._remoteConfig = this.firebase.remoteConfig();
    this._encryptionConfig = {};
  }

  public static get instance() {
    if (!Firebase._instance) Firebase._instance = new Firebase();

    return Firebase._instance;
  }

  public get firebase() {
    return this._firebase;
  }

  public get firestore() {
    return this._firestore;
  }

  public get remoteConfig() {
    return this._remoteConfig;
  }

  public get encryptionConfig() {
    return this._encryptionConfig;
  }

  private set encryptionConfig(value: HourChat.Encryption.EncryptionConfig) {
    this._encryptionConfig = value;
  }

  public async deleteCollection(collectionPath: string) {
    const paths = collectionPath.split('/');

    if (paths.length % 2 === 0)
      throw Error("Collection path must have an odd /'s");

    const collectionRef = this.firestore.collection(collectionPath);

    await this.deleteQueryBatch(collectionRef);
    await collectionRef?.parent?.delete?.();
  }

  public async deleteQueryBatch(query: Query) {
    const snapshots = await query.get();

    const batchSize = snapshots.size;
    if (!batchSize) return;

    const batch = this.firestore.batch();

    snapshots.docs.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();
  }

  public async sendEmail(payload: {
    to: string;
    message: {
      subject: string;
      html: string;
    };
  }) {
    return this.firestore.collection('mail').add(payload);
  }

  public getRemoteConfig() {
    return this.remoteConfig.getTemplate();
  }

  public async getEncryptionConfig() {
    const config = await this.getRemoteConfig();

    const encryptionConfig = JSON.parse(
      (
        config.parameters?.ENCRYPTION?.defaultValue as
          | undefined
          | { value: string }
      )?.value ?? '{}'
    ) as HourChat.Encryption.EncryptionConfig;

    if (!encryptionConfig) return;

    this.encryptionConfig = encryptionConfig;

    return encryptionConfig;
  }
}

export default Firebase;

import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import admin from 'firebase-admin';
import { Query } from 'firebase-admin/firestore';
import { ASSETS_PATH } from './constant';
import { UserAttribute } from '../components/users/models/attributes';
import { omit } from './common';

dotenvConfig();

class Firebase {
  // eslint-disable-next-line no-use-before-define
  private static _instance: Firebase;
  private _firebase: admin.app.App;
  private _firestore: admin.firestore.Firestore;
  private _remoteConfig: admin.remoteConfig.RemoteConfig;
  private _messaging: admin.messaging.Messaging;
  private _storage: admin.storage.Storage;

  constructor() {
    this._firebase = admin.initializeApp({
      credential: admin.credential.cert(
        require(path.resolve(ASSETS_PATH, 'firebase-service-account.json'))
      ),
      storageBucket: process.env.STORAGE_BUCKET,
    });
    this._firestore = this.firebase.firestore();
    this._remoteConfig = this.firebase.remoteConfig();
    this._storage = this.firebase.storage();
    this._messaging = this.firebase.messaging();
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

  public get storage() {
    return this._storage;
  }

  public get remoteConfig() {
    return this._remoteConfig;
  }

  public get messaging() {
    return this._messaging;
  }

  public createCustomSignInToken(value: UserAttribute) {
    return this.firebase
      .auth()
      .createCustomToken(value.id, omit(value, ['password']));
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

  public async sendNotification(token: string, payload: unknown) {
    return this.messaging.send({
      token,
      data: {
        payload: JSON.stringify(payload),
      },
    });
  }

  public async sendNotifications(tokens: string[], payload: unknown) {
    return this.messaging.sendEachForMulticast({
      tokens,
      data: {
        payload: JSON.stringify(payload),
      },
    });
  }

  public getRemoteConfig() {
    return this.remoteConfig.getTemplate();
  }
}

export default Firebase;

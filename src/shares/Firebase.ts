import path from 'path';
import admin from 'firebase-admin';
import { Query } from 'firebase-admin/firestore';
import { ASSETS_PATH } from './constant';

class Firebase {
  // eslint-disable-next-line no-use-before-define
  private static _instance: Firebase;
  private firebase: admin.app.App;
  private _firestore: admin.firestore.Firestore;

  constructor() {
    this.firebase = admin.initializeApp({
      credential: admin.credential.cert(
        require(path.resolve(ASSETS_PATH, 'firebase-service-account.json'))
      ),
    });
    this._firestore = this.firebase.firestore();
  }

  public static get instance() {
    if (!Firebase._instance) Firebase._instance = new Firebase();

    return Firebase._instance;
  }

  public get firestore() {
    return this._firestore;
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
}

export default Firebase;

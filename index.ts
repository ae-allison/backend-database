import admin from 'firebase-admin'
import { DocumentData } from '@google-cloud/firestore';
import * as types from '.';

admin.initializeApp({
  credential: admin.credential.cert('../config/firebaseAdminKey.json')
});

const db = admin.firestore();
 
export class Database {
  rootCollectionPath;
  rootCollection;

  constructor(collection: string){
    this.rootCollectionPath = db.collection(collection)
  }

  public addToRootPath(collection: string, doc: string){
    this.rootCollection = this.rootCollection.collection(collection).doc(doc);
  }

  public resetRootPath(){
    this.rootCollection = db
  }

  public findOneInDocuments(documentID: string): Promise<DocumentData> {
    return new Promise((resolve, reject) => {
      this.rootCollection
      .doc(documentID)
        .get()
        .then((snapshot) => resolve(snapshot.data()))
        .catch(reject);
    })
  }

  public findAllDocuments(): Promise<DocumentData[]> {
    return new Promise((resolve, reject) => {
      this.rootCollection
        .onSnapshot(snapshot => {
          snapshot.docs.map(doc => doc.data())
        }, reject)
    })
  }

  public updateDocument(id: string, update: {}) {
    // finish check to ensure stock list isn't already created.
    return new Promise((resolve, reject) => {
      let docRef = this.rootCollection.doc(id)
      docRef.update({ ...update }).then(resolve, reject)
    })
  }

  public createOne(properties, query) {
    return new Promise((resolve, reject) => {
      let docRef = this.rootCollection.doc(properties.name);
      docRef.set({ ...properties }).then(resolve, reject)
    })
  }
}
import admin from 'firebase-admin'
import { DocumentData } from '@google-cloud/firestore';

admin.initializeApp({
  credential: admin.credential.cert('./config/firebaseAdminKey.json')
});

const db = admin.firestore();
 
type RECORD = {
  id: string
}

export class Database {
  rootCollection: FirebaseFirestore.CollectionReference<DocumentData> | FirebaseFirestore.CollectionReference<DocumentData>;
  initialRoot: FirebaseFirestore.CollectionReference<DocumentData> | FirebaseFirestore.CollectionReference<DocumentData>;
  constructor(collection: string){
    this.rootCollection = db.collection(collection)
    this.initialRoot = db.collection(collection)
  }

  // public addToRootPath(collection: string, doc: string){
  //   this.rootCollection = this.rootCollection.doc(doc).collection(collection)
  // }

  // public resetRootPath(initialRoot?: string){
  //   initialRoot ? this.rootCollection = db.collection(initialRoot) : this.rootCollection = this.initialRoot
  // }

  public findOne(key: string, value: string): Promise<DocumentData> {
    return new Promise((resolve, reject) => {
      this.rootCollection.where(`${key}`, '==', value).get()
      .then(snapshot => {
        if (snapshot.empty) {
          reject('No matching documents.');
        }  
    
        snapshot.forEach(doc => {
          resolve(doc.data())
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      })
    })
  }

  public findAll(): Promise<DocumentData[]> {
    return new Promise((resolve, reject) => {
      this.rootCollection
        .onSnapshot(snapshot => {
          resolve(snapshot.docs.map(doc => doc.data()))
        }, reject)
    })
  }

  public async createAndUpdateOne(properties: RECORD) {
    try {
      return await this.rootCollection.doc(properties.id).set(properties);
    } catch(err){
      return err
    }
  }
}
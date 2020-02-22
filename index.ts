import { DocumentData } from '@google-cloud/firestore';

type RECORD = {
  id: string,
  [key: string]: any
}

type COLLECTION_PATH = { 
  firstCollection: string, 
  doc: string, 
  secondCollection: string 
}

type DOC_PATH = { 
  firstCollection: string, 
  doc: string, 
}

export class AE_Allision {
  firebaseCollection: FirebaseFirestore.CollectionReference<DocumentData> 
  firebaseDoc: FirebaseFirestore.DocumentReference<DocumentData> 

  constructor(db: FirebaseFirestore.Firestore , collection?: string, collectionPath?: COLLECTION_PATH, docPath?: DOC_PATH){
    if(!db) throw Error("DB requires a firebase database to initialize.")
    if(!collection || !collectionPath || !docPath){
      if(collectionPath){
        const { firstCollection, doc, secondCollection } = collectionPath
        this.firebaseCollection = db.collection(firstCollection).doc(doc).collection(secondCollection)
      } else if(docPath){
        const { firstCollection, doc } = docPath
        this.firebaseDoc = db.collection(firstCollection).doc(doc)
      } else {
        this.firebaseCollection = db.collection(collection)
      }
    } else throw Error("DB needs a collection or array of path to initialize.")
  }

  public async findOne(key: string, value: string): Promise<void |DocumentData> {
      return this.firebaseCollection.where(`${key}`, '==', value)
      .get()  
      .then(snapshot => {
        if (snapshot.empty) {
          return Promise.reject('No matching documents.');
        }  
        return Promise.resolve(snapshot.docs[0].data())
      }, err => console.log('Error getting documents', err))
  }

  public async findDataInDocument(): Promise<void |DocumentData> {
    return this.firebaseDoc
    .get()  
    .then(snapshot => {
      return Promise.resolve(snapshot.data())
    }, err => { 
      console.error(err, 'err')
      throw Error(err) 
    })
}

  public findAll(): Promise<DocumentData[]> {
    return new Promise((resolve, reject) => {
      this.firebaseCollection
        .onSnapshot(snapshot => {
          return resolve(snapshot.docs.map(doc => doc.data()))
        }, reject)
    })
  }

  public async createAndUpdateOne(properties: RECORD) {
    try {
      return await this.firebaseCollection.doc(properties.id).set(properties);
    } catch(err){
      return err
    }
  }
}
import { DocumentData } from '@google-cloud/firestore';

type RECORD = {
  id: string
}

type PATH = { 
  firstCollection: string, 
  doc: string, 
  secondCollection: string 
}

export class AE_Allision {
  rootCollection: FirebaseFirestore.CollectionReference<DocumentData> 
  initialRoot: FirebaseFirestore.CollectionReference<DocumentData>

  constructor(db: FirebaseFirestore.Firestore , collection?: string, path?: PATH){
    if(!db || !collection && !path) throw("DB needs a collection or array of path to initialize.")
    if(path){
      const { firstCollection, doc, secondCollection } = path
      this.rootCollection = db.collection(firstCollection).doc(doc).collection(secondCollection)
      this.initialRoot = db.collection(firstCollection).doc(doc).collection(secondCollection)
    } else {
      this.rootCollection = db.collection(collection)
      this.initialRoot = db.collection(collection)
    }
  }

  public async findOne(key: string, value: string): Promise<void |DocumentData> {
      return this.rootCollection.where(`${key}`, '==', value)
      .get()  
      .then(snapshot => {
        if (snapshot.empty) {
          return Promise.reject('No matching documents.');
        }  
        return Promise.resolve(snapshot.docs[0].data())
      }, err => console.log('Error getting documents', err))
  }

  public findAll(): Promise<DocumentData[]> {
    return new Promise((resolve, reject) => {
      this.rootCollection
        .onSnapshot(snapshot => {
          return resolve(snapshot.docs.map(doc => doc.data()))
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
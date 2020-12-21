import { DocumentData } from "@google-cloud/firestore";
import { RECORD } from "./index.d";

export class AE_Allision {
  constructor(db: FirebaseFirestore.Firestore, collectionPath?: string[]) {
    console.log("Initializing db from path ... ", collectionPath);
    if (!db) throw Error("DB requires a firebase database to initialize.");
    if (collectionPath) {
      this.db = db;
      this.setReference(collectionPath);
    } else throw Error("DB needs a collection or array of path to initialize.");
  }

  private db: FirebaseFirestore.Firestore;
  private aeReference:
    | any
    | FirebaseFirestore.DocumentReference<DocumentData>
    | FirebaseFirestore.CollectionReference<DocumentData>;

  public AEDocument: AE_Document;
  public AECollection: AE_Collection;

  private setReference = (path: string[]) => {
    // Dynamically set the reference to use
    let dbToUse: any = this.db;

    path.forEach((item, index) => {
      if (index % 2 === 0) {
        dbToUse = dbToUse.collection(item) as any;
      } else {
        dbToUse = dbToUse.doc(item) as any;
      }
    });
    if (path.length % 2 !== 0) {
      let castDBToUse = dbToUse as unknown;
      this.aeReference = castDBToUse as FirebaseFirestore.CollectionReference<
        DocumentData
      >;
      this.AECollection = new AE_Collection(this.aeReference);
    } else {
      let castDBToUse = dbToUse as unknown;
      this.aeReference = castDBToUse as FirebaseFirestore.DocumentReference<
        DocumentData
      >;
      this.AEDocument = new AE_Document(this.aeReference);
    }
  };
}

class AE_Document {
  private aeReference;
  constructor(aeReference) {
    this.aeReference = aeReference;
  }
  public async findDataInDocument(): Promise<void | DocumentData> {
    return this.aeReference.get().then(
      snapshot => {
        return Promise.resolve(snapshot.data());
      },
      err => {
        throw Error(err);
      }
    );
  }
}

class AE_Collection {
  private aeReference;
  constructor(aeReference) {
    this.aeReference = aeReference;
  }
  public async findOne(
    key: string,
    value: string
  ): Promise<void | DocumentData> {
    return this.aeReference
      .where(`${key}`, "==", value)
      .get()
      .then(
        snapshot => {
          if (snapshot.empty) {
            return Promise.reject("No matching documents.");
          }
          return Promise.resolve(snapshot.docs[0].data());
        },
        err => console.log("Error getting documents", err)
      );
  }

  public findAll(): Promise<DocumentData[]> {
    return new Promise((resolve, reject) => {
      this.aeReference.onSnapshot(snapshot => {
        return resolve(snapshot.docs.map(doc => doc.data()));
      }, reject);
    });
  }

  public async createAndUpdateOne(properties: RECORD) {
    try {
      return await this.aeReference.doc(properties.id).set(properties);
    } catch (err) {
      return err;
    }
  }
}

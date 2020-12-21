import { DocumentData } from "@google-cloud/firestore";
import { RECORD } from "./index.d";

export class AE_Allision {
  constructor(db: FirebaseFirestore.Firestore, collectionPath?: string[]) {
    console.log("Initializing db from path ... ", collectionPath);
    if (!db) throw Error("DB requires a firebase database to initialize.");
    if (collectionPath) {
      this.db = db;
      this.setReference(collectionPath);
      console.log(this.aeReference, "ae Reference");
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

  // public static async createBackup(
  //   db,
  //   path: {
  //     companyPath: string[];
  //     admin: string;
  //     client: string;
  //   }
  // ) {
  //   // backup company info
  //   const companyInfo = (
  //     await db
  //       .collection(path.companyPath[0])
  //       .doc(path.companyPath[1])
  //       .get()
  //   ).data();
  //   // backup admin info
  //   const adminInfo = (
  //     await db
  //       .collection(path.companyPath[0])
  //       .doc(path.companyPath[1])
  //       .collection(path.admin)
  //       .get()
  //   ).docs.map(doc => doc.data());

  //   const clientInfo = (
  //     await db
  //       .collection(path.companyPath[0])
  //       .doc(path.companyPath[1])
  //       .collection(path.client)
  //       .get()
  //   ).docs.map(doc => doc.data());

  //   const backup = {
  //     time:
  //       new Date().toDateString() +
  //       " - " +
  //       new Date().getHours().toString() +
  //       ":" +
  //       new Date().getMinutes().toString(),
  //     companyInfo,
  //     [`${path.admin}`]: adminInfo,
  //     [`${path.client}`]: clientInfo
  //   };

  //   // Store backup
  //   await db.collection("backups").add(backup);
  //   return backup;
  // }
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

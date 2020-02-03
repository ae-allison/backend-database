"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert('./config/firebaseAdminKey.json')
});
const db = firebase_admin_1.default.firestore();
class Database {
    constructor(rootCollectionPath) {
        this.rootCollectionPath = rootCollectionPath;
    }
    addToRootPath(collectionName) {
        this.rootCollection = this.rootCollection.collection(collectionName);
    }
    resetRootPath() {
        this.rootCollection = db;
    }
    findOneInDocuments(documentID) {
        return new Promise((resolve, reject) => {
            this.rootCollection
                .doc(documentID)
                .get()
                .then((snapshot) => resolve(snapshot.data()))
                .catch(reject);
        });
    }
    findAllDocuments() {
        return new Promise((resolve, reject) => {
            this.rootCollection
                .onSnapshot(snapshot => {
                snapshot.docs.map(doc => doc.data());
            }, reject);
        });
    }
    updateDocument(id, update) {
        // finish check to ensure stock list isn't already created.
        return new Promise((resolve, reject) => {
            let docRef = this.rootCollection.doc(id);
            docRef.update(Object.assign({}, update)).then(resolve, reject);
        });
    }
    createOne(properties, query) {
        return new Promise((resolve, reject) => {
            let docRef = this.rootCollection.doc(properties.name);
            docRef.set(Object.assign({}, properties)).then(resolve, reject);
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=index.js.map
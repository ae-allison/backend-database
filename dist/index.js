"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    constructor(collection) {
        this.rootCollection = db.collection(collection);
        this.initialRoot = db.collection(collection);
    }
    // public addToRootPath(collection: string, doc: string){
    //   this.rootCollection = this.rootCollection.doc(doc).collection(collection)
    // }
    // public resetRootPath(initialRoot?: string){
    //   initialRoot ? this.rootCollection = db.collection(initialRoot) : this.rootCollection = this.initialRoot
    // }
    findOne(key, value) {
        return new Promise((resolve, reject) => {
            this.rootCollection.where(`${key}`, '==', value).get()
                .then(snapshot => {
                if (snapshot.empty) {
                    reject('No matching documents.');
                }
                snapshot.forEach(doc => {
                    resolve(doc.data());
                });
            })
                .catch(err => {
                console.log('Error getting documents', err);
            });
        });
    }
    findAll() {
        return new Promise((resolve, reject) => {
            this.rootCollection
                .onSnapshot(snapshot => {
                resolve(snapshot.docs.map(doc => doc.data()));
            }, reject);
        });
    }
    createAndUpdateOne(properties) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.rootCollection.doc(properties.id).set(properties);
            }
            catch (err) {
                return err;
            }
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=index.js.map
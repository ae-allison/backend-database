"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class AE_Allision {
    constructor(db, collectionPath) {
        this.setReference = (path) => {
            let dbToUse = this.db;
            path.forEach((item, index) => {
                if (index % 2 === 0) {
                    dbToUse = dbToUse.collection(item);
                    console.log(dbToUse.onSnapshot, "db to use");
                }
                else {
                    dbToUse = dbToUse.doc(item);
                }
            });
            if (path.length % 2 !== 0) {
                let castDBToUse = dbToUse;
                this.aeReference = castDBToUse;
            }
            else {
                let castDBToUse = dbToUse;
                this.aeReference = castDBToUse;
            }
        };
        console.log("Initializing db from path ... ", collectionPath);
        if (!db)
            throw Error("DB requires a firebase database to initialize.");
        if (collectionPath) {
            this.db = db;
            this.setReference(collectionPath);
            console.log(this.aeReference, "ae Reference");
        }
        else
            throw Error("DB needs a collection or array of path to initialize.");
    }
    findOne(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.aeReference
                .where(`${key}`, "==", value)
                .get()
                .then(snapshot => {
                if (snapshot.empty) {
                    return Promise.reject("No matching documents.");
                }
                return Promise.resolve(snapshot.docs[0].data());
            }, err => console.log("Error getting documents", err));
        });
    }
    findDataInDocument() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.aeReference.get().then(snapshot => {
                return Promise.resolve(snapshot.data());
            }, err => {
                throw Error(err);
            });
        });
    }
    findAll() {
        return new Promise((resolve, reject) => {
            this.aeReference.onSnapshot(snapshot => {
                return resolve(snapshot.docs.map(doc => doc.data()));
            }, reject);
        });
    }
    createAndUpdateOne(properties) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.aeReference.doc(properties.id).set(properties);
            }
            catch (err) {
                return err;
            }
        });
    }
    static createBackup(db, path) {
        return __awaiter(this, void 0, void 0, function* () {
            // backup company info
            const companyInfo = (yield db
                .collection(path.companyType)
                .doc(path.companyName)
                .get()).data();
            // backup admin info
            const adminInfo = (yield db
                .collection(path.companyType)
                .doc(path.companyName)
                .collection(path.admin)
                .get()).docs.map(doc => doc.data());
            const clientInfo = (yield db
                .collection(path.companyType)
                .doc(path.companyName)
                .collection(path.client)
                .get()).docs.map(doc => doc.data());
            const backup = {
                time: new Date().toDateString() +
                    " - " +
                    new Date().getHours().toString() +
                    ":" +
                    new Date().getMinutes().toString(),
                companyInfo,
                [`${path.admin}`]: adminInfo,
                [`${path.client}`]: clientInfo
            };
            // Store backup
            yield db.collection("backups").add(backup);
            return backup;
        });
    }
}
exports.AE_Allision = AE_Allision;
//# sourceMappingURL=index.js.map
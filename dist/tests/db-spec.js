"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert = __importStar(require("assert"));
const sinon_1 = __importDefault(require("sinon"));
const __1 = require("../");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert("./config/firebaseAdminKey.json"),
    databaseURL: "https://website-builder-c685d.firebaseio.com"
});
exports.firebase = firebase_admin_1.default;
const db = exports.firebase.firestore();
describe("AE_Allision class", () => {
    let sandbox;
    const database = new __1.AE_Allision(db, ["websites"]);
    beforeEach(() => {
        // stub out all database functions
        sandbox = sinon_1.default.createSandbox();
    });
    afterEach(() => {
        // restore all mongo db functions
        sandbox.restore();
    });
    describe("Initializing db wrapper lib", () => {
        it("it should fail because a collection or path was not passed", () => {
            assert.throws(() => {
                new __1.AE_Allision(db);
            });
        });
        it.only("it should initialize", () => __awaiter(this, void 0, void 0, function* () {
            const allWebsites = yield new __1.AE_Allision(db, [
                "ju",
                "data",
                "test"
            ]).findAll();
            console.log(allWebsites, "all websites");
        }));
    });
    describe("createBackup", () => {
        it("it create a backup of database", () => __awaiter(this, void 0, void 0, function* () {
            const backup = yield __1.AE_Allision.createBackup(db, {
                companyType: "websites",
                companyName: "kingju",
                admin: "merchandise",
                client: "temp"
            });
            return Promise.resolve();
        }));
    });
    describe("findAllDocuments", () => {
        it("it should find all documents", () => __awaiter(this, void 0, void 0, function* () {
            const docs = yield database.findAll();
            const expectedDocuments = [
                { picture: "grok.io", title: "King Ju", name: "kingju" }
            ];
            assert.deepEqual(docs[0], expectedDocuments[0]);
            return;
        }));
    });
    describe("findOne", () => {
        it("it should find one document", () => __awaiter(this, void 0, void 0, function* () {
            const docs = yield database.findOne("id", "kingju");
            const expectedDoc = { picture: ".pg", title: "King Ju", id: "kingju" };
            assert.deepEqual(docs, expectedDoc);
            return;
        }));
        it("it should not find the document", () => __awaiter(this, void 0, void 0, function* () {
            yield database.findOne("name", "f").then(docs => { }, err => {
                assert.equal(err, "No matching documents.");
            });
        }));
    });
    describe("findDataInDocument", () => {
        it("it should find all data inside document", () => __awaiter(this, void 0, void 0, function* () {
            const fieldDb = new __1.AE_Allision(db, ["websites", "kingju"]);
            const docs = yield fieldDb.findDataInDocument();
            const expectedDoc = { picture: ".pg", title: "King Ju", id: "kingju" };
            assert.deepEqual(docs, expectedDoc);
            return;
        }));
    });
    describe("createOne", () => {
        it("it should create one document", () => __awaiter(this, void 0, void 0, function* () {
            const doc = { picture: ".pg", title: "King Ju", id: "kingju" };
            try {
                yield database.createAndUpdateOne(doc);
                return;
            }
            catch (err) {
                return err;
            }
        }));
    });
});
//# sourceMappingURL=db-spec.js.map
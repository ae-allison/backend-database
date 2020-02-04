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
describe('Database class', () => {
    let sandbox;
    beforeEach(() => {
        // stub out all database functions
        sandbox = sinon_1.default.createSandbox();
    });
    afterEach(() => {
        // restore all mongo db functions
        sandbox.restore();
    });
    describe('findAllDocuments', () => {
        it('it should find all documents', () => __awaiter(this, void 0, void 0, function* () {
            const docs = yield new __1.Database('websites').findAll();
            const expectedDocuments = [
                { picture: 'grok.io', title: 'King Ju', name: 'kingju' }
            ];
            assert.deepEqual(docs[0], expectedDocuments[0]);
            return;
        }));
        it('it should not find the documents', () => __awaiter(this, void 0, void 0, function* () {
            assert.throws(() => {
                new __1.Database('').findAll().then(docs => {
                    return;
                });
            });
        }));
    });
    describe('findOne', () => {
        it('it should find one document', () => __awaiter(this, void 0, void 0, function* () {
            const docs = yield new __1.Database('websites').findOne('name', 'kingju');
            const expectedDoc = { picture: 'grok.io', title: 'King Ju', name: 'kingju' };
            assert.deepEqual(docs, expectedDoc);
            return;
        }));
        it('it should not find the document', () => __awaiter(this, void 0, void 0, function* () {
            yield new __1.Database('websites').findOne('name', 'f').then(docs => {
            }, err => {
                assert.equal(err, 'No matching documents.');
            });
        }));
    });
    describe('createOne', () => {
        it('it should create one document', () => __awaiter(this, void 0, void 0, function* () {
            const doc = { picture: 'grok.io', title: 'King Ju', id: 'kingju' };
            try {
                yield new __1.Database('websites').createAndUpdateOne(doc);
                return;
            }
            catch (err) {
                return err;
            }
        }));
    });
});
//# sourceMappingURL=db-spec.js.map
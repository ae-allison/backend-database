import 'mocha';
import * as assert from 'assert';
import sinon from 'sinon';
import { AE_Allision } from '../'
import admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.cert('./config/firebaseAdminKey.json')
  });
  
  const db = admin.firestore();
  
  
describe('AE_Allision class', () => {
    let sandbox;
    const database = new AE_Allision(db,'websites')
    beforeEach(() => {
        // stub out all database functions
        sandbox = sinon.createSandbox()
        
    })

    afterEach(() => {
        // restore all mongo db functions
        sandbox.restore();
    })

    describe('Initializing db wrapper lib', () => {
        it('it should fail because a collection or path was not passed', () => {
           assert.throws(() => {
               new AE_Allision(db)
           })
        })
        it('it should initialize', () => {
            new AE_Allision(db, 'test')
         })
    })

    describe('findAllDocuments', () => {
        it('it should find all documents', async () => {
           const docs = await database.findAll()
           const expectedDocuments = [
            { picture: 'grok.io', title: 'King Ju', name: 'kingju' }
           ]
           assert.deepEqual(docs[0], expectedDocuments[0]);
           return
        })
    })

    describe('findOne', () => {
        it('it should find one document', async () => {
           const docs = await database.findOne('id', 'kingju')
           const expectedDoc = { picture: 'grok.io', title: 'King Ju', id: 'kingju' }
           assert.deepEqual(docs, expectedDoc);
           return
        })
        it('it should not find the document', async () => {
            await database.findOne('name', 'f').then(docs => {
            }, err => {
                assert.equal(err, 'No matching documents.')
            })
        })
    })

    describe('findDataInDocument', () => {
        it('it should find all data inside document', async () => {
           const fieldDb = new AE_Allision(db, null, null, { firstCollection: 'websites', doc: 'kingju'}) 
           const docs = await fieldDb.findDataInDocument()
           const expectedDoc = { picture: 'grok.io', title: 'King Ju', id: 'kingju' }
           assert.deepEqual(docs, expectedDoc);
           return
        })
    })

    describe('createOne', () => {
        it('it should create one document', async () => {
           const doc = { picture: 'grok.io', title: 'King Ju', id: 'kingju' }
           try {
               await database.createAndUpdateOne(doc)
               return 
           } catch(err){
               return err
           }
        })
    })
})
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
           const docs = await new AE_Allision(db,'websites').findAll()
           const expectedDocuments = [
            { picture: 'grok.io', title: 'King Ju', name: 'kingju' }
           ]
           assert.deepEqual(docs[0], expectedDocuments[0]);
           return
        })
    })

    describe('findOne', () => {
        it('it should find one document', async () => {
           const docs = await new AE_Allision(db,'websites').findOne('id', 'kingju')
           const expectedDoc = { picture: 'grok.io', title: 'King Ju', id: 'kingju' }
           assert.deepEqual(docs, expectedDoc);
           return
        })
        it('it should not find the document', async () => {
            await new AE_Allision(db,'websites').findOne('name', 'f').then(docs => {
            }, err => {
                assert.equal(err, 'No matching documents.')
            })
        })
    })

    describe('createOne', () => {
        it('it should create one document', async () => {
           const doc = { picture: 'grok.io', title: 'King Ju', id: 'kingju' }
           try {
               await new AE_Allision(db,'websites').createAndUpdateOne(doc)
               return 
           } catch(err){
               return err
           }
        })
    })
})
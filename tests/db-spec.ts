import 'mocha';
import * as assert from 'assert';
import sinon from 'sinon';
import { Database } from '../'

describe('Database class', () => {
    let sandbox;

    beforeEach(() => {
        // stub out all database functions
        sandbox = sinon.createSandbox()
        
    })

    afterEach(() => {
        // restore all mongo db functions
        sandbox.restore();
    })

    describe('findAllDocuments', () => {
        it('it should find all documents', async () => {
           const docs = await new Database('websites').findAll()
           const expectedDocuments = [
            { picture: 'grok.io', title: 'King Ju', name: 'kingju' }
           ]
           assert.deepEqual(docs[0], expectedDocuments[0]);
           return
        })
        it('it should not find the documents', async () => {
            assert.throws( ()=> {
                new Database('').findAll().then(docs => {
                    return 
                })
            })
         })
    })

    describe('findOne', () => {
        it('it should find one document', async () => {
           const docs = await new Database('websites').findOne('name', 'kingju')
           const expectedDoc = { picture: 'grok.io', title: 'King Ju', name: 'kingju' }
           assert.deepEqual(docs, expectedDoc);
           return
        })
        it('it should not find the document', async () => {
            await new Database('websites').findOne('name', 'f').then(docs => {
            }, err => {
                assert.equal(err, 'No matching documents.')
            })
        })
    })

    describe('createOne', () => {
        it('it should create one document', async () => {
           const doc = { picture: 'grok.io', title: 'King Ju', id: 'kingju' }
           try {
               await new Database('websites').createAndUpdateOne(doc)
               return 
           } catch(err){
               return err
           }
        })
    })
})
const expect = require('expect');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('firebase-db.js', () => {
  const signInWithEmailAndPassword = sinon.stub();
  const initializeApp = sinon.stub();
  const databaseStub = sinon.stub();
  const firebase = { database: () => databaseStub, initializeApp, auth: () => ({ signInWithEmailAndPassword }) };

  beforeEach(() => {
    delete process.env.FIREBASE_CONFIG;
    delete process.env.FIREBASE_PASSWORD;
    delete process.env.FIREBASE_USER;
  });

  it('initializes firebase with default credentials', async () => {
    const firebaseDb = proxyquire('../../src/utils/firebase-db',
      { 'firebase/app': firebase, 'firebase/datbase': sinon.stub() });

    const database = await firebaseDb;
    expect(database).toEqual(databaseStub);
    sinon.assert.calledWith(firebase.initializeApp, {
      apiKey: 'AIzaSyAC26X8bWaMmZJ-v5yr6NsJaLdXkOBDGIs',
      authDomain: 'was-today-better-dev.firebaseapp.com',
      databaseURL: 'https://was-today-better-dev.firebaseio.com',
      projectId: 'was-today-better-dev',
      storageBucket: 'was-today-better-dev.appspot.com',
      messagingSenderId: '110009410201',
    });
    sinon.assert.calledWith(signInWithEmailAndPassword, 'test-user@klausbayrhammer.com', '7gXAG2E5dxWTZsWzR9Q5');
  });

  it('initializes firebase with environment variable credentials', async () => {
    process.env.FIREBASE_CONFIG = JSON.stringify({ firebase: 'config' });
    const firebaseDb = proxyquire('../../src/utils/firebase-db',
      { 'firebase/app': firebase, 'firebase/datbase': sinon.stub() });

    await firebaseDb;
    sinon.assert.calledWith(firebase.initializeApp, { firebase: 'config' });
  });

  it('uses env vars for user and password', async () => {
    process.env.FIREBASE_USER = 'firebase-user';
    process.env.FIREBASE_PASSWORD = 'firebase-password';
    const firebaseDb = proxyquire('../../src/utils/firebase-db',
      { 'firebase/app': firebase, 'firebase/datbase': sinon.stub() });

    await firebaseDb;
    sinon.assert.calledWith(signInWithEmailAndPassword, 'firebase-user', 'firebase-password');
  });
});

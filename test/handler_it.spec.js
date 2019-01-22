const expect = require('expect');
const firebase = require('firebase/app');
require('firebase/database');
require('firebase/auth');
const handler = require('../src/handler');

describe('handler integration test', () => {
  let firebaseApp;

  before(async () => {
    firebaseApp = await firebase.initializeApp({
      apiKey: 'AIzaSyAC26X8bWaMmZJ-v5yr6NsJaLdXkOBDGIs',
      authDomain: 'was-today-better-dev.firebaseapp.com',
      databaseURL: 'https://was-today-better-dev.firebaseio.com',
      projectId: 'was-today-better-dev',
      storageBucket: 'was-today-better-dev.appspot.com',
      messagingSenderId: '110009410201',
    }, 'test-connection');
    await firebaseApp.auth().signInWithEmailAndPassword('test-user@klausbayrhammer.com', '7gXAG2E5dxWTZsWzR9Q5');

    await firebaseApp.database().ref('/tnvxVYhwOHdITymrEsQahnyzrP73/focusAreas').set({
      123123123: { deleted: false, name: 'TDD' },
    });
  });

  after(() => {
    firebaseApp.database().goOffline();
    firebase.database().goOffline();
  });

  it('resolves the LaunchIntent successfully', (done) => {
    const event = {
      version: '1.0',
      session: {},
      request: {
        type: 'LaunchRequest',
      },
    };
    handler(event, {}, (error, response) => {
      try {
        expect(response.response).toEqual({
          outputSpeech: {
            type: 'SSML',
            ssml: '<speak>Was today better than yesterday in regards of TDD</speak>',
          },
        });
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});

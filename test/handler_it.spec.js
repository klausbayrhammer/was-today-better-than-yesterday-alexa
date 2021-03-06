const expect = require('expect');
const firebase = require('firebase/app');
require('firebase/database');
require('firebase/auth');

const handler = require('../src/handler');

function getTodaysDate() {
  return new Date().toISOString().split('T')[0];
}

describe('handler integration test', () => {
  let firebaseApp;

  before(async function () {
    this.timeout(10000);
    process.env.FIREBASE_USER_OID = 'userOid';
    firebaseApp = await firebase.initializeApp({
      apiKey: 'AIzaSyAC26X8bWaMmZJ-v5yr6NsJaLdXkOBDGIs',
      authDomain: 'was-today-better-dev.firebaseapp.com',
      databaseURL: 'https://was-today-better-dev.firebaseio.com',
      projectId: 'was-today-better-dev',
      storageBucket: 'was-today-better-dev.appspot.com',
      messagingSenderId: '110009410201',
    }, 'test-connection');
    await firebaseApp.auth().signInWithEmailAndPassword('test-user@klausbayrhammer.com', '7gXAG2E5dxWTZsWzR9Q5');
  });

  beforeEach(async () => {
    await firebaseApp.database().ref('/userOid/focusAreas').set({
      123: { deleted: false, name: 'TDD' },
    });
  });

  after(() => {
    firebaseApp.delete();
    firebaseApp.auth().signOut();
    firebase.app().delete();
    firebase.auth().signOut();
  });

  it('resolves the LaunchIntent successfully', function (done) {
    this.timeout(10000);
    const event = {
      version: '1.0',
      session: {},
      request: {
        locale: 'en-GB',
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
          shouldEndSession: false,
        });
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('adds a focus area entry for AddEntryBetter Intents', function (done) {
    this.timeout(10000);
    const event = {
      version: '1.0',
      session: {
        attributes: {
          lastFocusAreaId: '123',
        },
      },
      request: {
        locale: 'en-GB',
        type: 'IntentRequest',
        intent: {
          name: 'AddFocusAreaEntryBetter',
        },
      },
    };
    handler(event, {}, async (error, response) => {
      try {
        expect(response.response).toEqual({
          outputSpeech: {
            type: 'SSML',
            ssml: '<speak>Your current Streak for TDD is 1, longest 1. You are done for today - you added entries to all focus areas</speak>',
          },
          shouldEndSession: true,
        });
        const actualEntry = await firebaseApp.database().ref(`/userOid/focusAreas/123/entries/${getTodaysDate()}`).once('value');
        expect(actualEntry.val()).toEqual(1);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});

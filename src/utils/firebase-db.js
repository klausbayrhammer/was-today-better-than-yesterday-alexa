const firebase = require('firebase/app');
require('firebase/database');
require('firebase/auth');

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAC26X8bWaMmZJ-v5yr6NsJaLdXkOBDGIs',
  authDomain: 'was-today-better-dev.firebaseapp.com',
  databaseURL: 'https://was-today-better-dev.firebaseio.com',
  projectId: 'was-today-better-dev',
  storageBucket: 'was-today-better-dev.appspot.com',
  messagingSenderId: '110009410201',
};

function getFirebaseConfig() {
  if (process.env.FIREBASE_CONFIG) {
    return JSON.parse(process.env.FIREBASE_CONFIG);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

module.exports = new Promise(async (resolve) => {
  firebase.initializeApp(getFirebaseConfig());
  const email = process.env.FIREBASE_USER || 'test-user@klausbayrhammer.com';
  const password = process.env.FIREBASE_PASSWORD || '7gXAG2E5dxWTZsWzR9Q5';
  await firebase.auth().signInWithEmailAndPassword(email, password);
  const database = firebase.database();
  resolve(database);
});

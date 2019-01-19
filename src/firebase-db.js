const firebase = require('firebase/app');
require('firebase/database');

module.exports = new Promise(async (resolve) => {
  firebase.initializeApp({
    apiKey: 'AIzaSyAC26X8bWaMmZJ-v5yr6NsJaLdXkOBDGIs',
    authDomain: 'was-today-better-dev.firebaseapp.com',
    databaseURL: 'https://was-today-better-dev.firebaseio.com',
    projectId: 'was-today-better-dev',
    storageBucket: 'was-today-better-dev.appspot.com',
    messagingSenderId: '110009410201',
  });
  await firebase.auth().signInWithEmailAndPassword('test-user@klausbayrhammer.com', '7gXAG2E5dxWTZsWzR9Q5');
  const database = firebase.database();
  resolve(database);
});

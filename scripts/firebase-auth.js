const firebase = require('firebase');

const conf = {
  apiKey: 'AIzaSyAC26X8bWaMmZJ-v5yr6NsJaLdXkOBDGIs',
    authDomain: 'was-today-better-dev.firebaseapp.com',
  databaseURL: 'https://was-today-better-dev.firebaseio.com',
  projectId: 'was-today-better-dev',
  storageBucket: 'was-today-better-dev.appspot.com',
  messagingSenderId: '110009410201'
}

firebase.initializeApp(conf)

firebase.auth().signInWithEmailAndPassword(process.env.EMAIL, process.env.PASSWORD).then(() => {
  console.log('signed in')
  firebase.database().ref(`/${process.env.UID}/focusAreas`).on('value', function (snapshot) {
    console.log(snapshot.val())
  })

}).catch(function(error) {
  console.log(error)
});

const firebaseDb = require('./firebase-db');

module.exports = async () => {
  const db = await firebaseDb;
  const ref = db.ref('/tnvxVYhwOHdITymrEsQahnyzrP73/focusAreas');
  const snapshot = await ref.once('value');
  return snapshot.val();
};

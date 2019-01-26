const firebaseDb = require('./firebase-db');
const userOid = require('./user-oid');

module.exports = async () => {
  const db = await firebaseDb;
  const ref = db.ref(`/${userOid()}/focusAreas`);
  const snapshot = await ref.once('value');
  return snapshot.val();
};

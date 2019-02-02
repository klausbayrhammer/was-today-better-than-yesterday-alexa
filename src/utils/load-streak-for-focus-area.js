const firebaseDb = require('./firebase-db');
const userOid = require('./user-oid');

module.exports = async (id) => {
  const db = await firebaseDb;
  const ref = db.ref(`/${userOid()}/focusAreas/${id}`);
  const snapshot = await ref.once('value');
  const focusArea = snapshot.val();
  return { name: focusArea.name, current: focusArea['@streak'].current, longest: focusArea['@streak'].longest };
};

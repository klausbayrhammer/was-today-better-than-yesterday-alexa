const firebaseDb = require('./firebase-db');
const userOid = require('./user-oid');

function getTodaysDate() {
  return new Date().toISOString().split('T')[0];
}

module.exports = async ({ id, value }) => {
  const db = await firebaseDb;
  await db.ref(`/${userOid()}/focusAreas/${id}/entries/${getTodaysDate()}`).set(value);
};

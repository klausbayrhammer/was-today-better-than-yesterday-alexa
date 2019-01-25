const firebaseDb = require('./firebase-db');

function getTodaysDate() {
  return new Date().toISOString().split('T')[0];
}

module.exports = async ({ id, value }) => {
  const db = await firebaseDb;
  await db.ref(`/tnvxVYhwOHdITymrEsQahnyzrP73/focusAreas/${id}/entries/${getTodaysDate()}`).set(value);
};

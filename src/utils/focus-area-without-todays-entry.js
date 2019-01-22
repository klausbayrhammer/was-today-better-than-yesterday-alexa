const loadFocusAreas = require('./load-focus-areas');

function focusAreaEntryForTodayexists(focusArea) {
  const todaysDate = new Date().toISOString().split('T')[0];
  return {}.hasOwnProperty.call(focusArea.entries, todaysDate);
}

function focusAreasWithoutTodaysEntry(focusArea) {
  return !focusArea.deleted && !(focusArea.entries && focusAreaEntryForTodayexists(focusArea));
}

module.exports = async () => {
  const focusAreas = await loadFocusAreas();
  if (!focusAreas) {
    return undefined;
  }
  return Object.keys(focusAreas)
    .map(id => Object.assign({ id }, focusAreas[id]))
    .find(focusArea => focusAreasWithoutTodaysEntry(focusArea));
};

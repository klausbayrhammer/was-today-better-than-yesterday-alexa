const focusAreaWithoutTodaysEntries = require('../utils/focus-area-without-todays-entry');
const loadStreakForFocusArea = require('../utils/load-streak-for-focus-area');

async function getStreakInfo(lastFocusAreaId) {
  if (lastFocusAreaId) {
    const { name, current, longest } = await loadStreakForFocusArea(lastFocusAreaId);
    return `Your current Streak for ${name} is ${current}, longest ${longest}. `;
  }
  return '';
}

module.exports = async (handlerInput) => {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  const streak = await getStreakInfo(sessionAttributes.lastFocusAreaId);
  const focusArea = await focusAreaWithoutTodaysEntries();
  if (!focusArea) {
    return handlerInput.responseBuilder
      .speak(`${streak}You are done for today - you added entries to all focus areas`)
      .withShouldEndSession(true)
      .getResponse();
  }
  sessionAttributes.lastFocusAreaId = focusArea.id;
  return handlerInput.responseBuilder
    .speak(`${streak}Was today better than yesterday in regards of ${focusArea.name}`)
    .withShouldEndSession(false)
    .getResponse();
};

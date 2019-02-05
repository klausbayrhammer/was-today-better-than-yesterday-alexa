const focusAreaWithoutTodaysEntries = require('../utils/focus-area-without-todays-entry');
const loadStreakForFocusArea = require('../utils/load-streak-for-focus-area');
const translate = require('../translate/translate');

async function streakAndDoneForToday(sessionAttributes, handlerInput, locale) {
  const { name, current, longest } = await loadStreakForFocusArea(sessionAttributes.lastFocusAreaId);
  return handlerInput.responseBuilder
    .speak(translate(locale, 'STREAK_AND_DONE_FOR_TODAY', name, current, longest))
    .withShouldEndSession(true)
    .getResponse();
}

function doneForToday(handlerInput, locale) {
  return handlerInput.responseBuilder
    .speak(translate(locale, 'DONE_FOR_TODAY'))
    .withShouldEndSession(true)
    .getResponse();
}

async function streakAndNextFocusArea(sessionAttributes, focusArea, handlerInput, locale) {
  const { name, current, longest } = await loadStreakForFocusArea(sessionAttributes.lastFocusAreaId);
  sessionAttributes.lastFocusAreaId = focusArea.id;

  return handlerInput.responseBuilder
    .speak(translate(locale, 'STREAK_AND_NEXT_FOCUS_AREA', name, current, longest, focusArea.name))
    .withShouldEndSession(false)
    .getResponse();
}

function nextFocusArea(sessionAttributes, focusArea, handlerInput, locale) {
  sessionAttributes.lastFocusAreaId = focusArea.id;
  return handlerInput.responseBuilder
    .speak(translate(locale, 'NEXT_FOCUS_AREA', focusArea.name))
    .withShouldEndSession(false)
    .getResponse();
}

module.exports = async (handlerInput) => {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  const focusArea = await focusAreaWithoutTodaysEntries();
  const { locale } = handlerInput.requestEnvelope.request;
  if (!focusArea) {
    if (sessionAttributes.lastFocusAreaId) {
      return streakAndDoneForToday(sessionAttributes, handlerInput, locale);
    }
    return doneForToday(handlerInput, locale);
  }
  if (sessionAttributes.lastFocusAreaId) {
    return streakAndNextFocusArea(sessionAttributes, focusArea, handlerInput, locale);
  }
  return nextFocusArea(sessionAttributes, focusArea, handlerInput, locale);
};

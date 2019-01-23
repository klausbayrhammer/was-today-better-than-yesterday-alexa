const focusAreaWithoutTodaysEntries = require('../utils/focus-area-without-todays-entry');

module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const focusArea = await focusAreaWithoutTodaysEntries();
    if (!focusArea) {
      return handlerInput.responseBuilder
        .speak('You are done for today - you added entries to all focus areas')
        .withShouldEndSession(true)
        .getResponse();
    }
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.lastFocusAreaId = focusArea.id;
    return handlerInput.responseBuilder
      .speak(`Was today better than yesterday in regards of ${focusArea.name}`)
      .withShouldEndSession(false)
      .getResponse();
  },
};

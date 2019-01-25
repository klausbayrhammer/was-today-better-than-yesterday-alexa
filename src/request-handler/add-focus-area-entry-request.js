const addFocusAreaEntry = require('../utils/add-focus-area-entry');
const requestNextFocusAreaEntry = require('./request-next-focus-area-entry');

module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'AddFocusAreaEntryBetter';
  },
  async handle(handlerInput) {
    const { lastFocusAreaId } = handlerInput.attributesManager.getSessionAttributes();
    await addFocusAreaEntry({ id: lastFocusAreaId, value: 1 });
    return requestNextFocusAreaEntry(handlerInput);
  },
};

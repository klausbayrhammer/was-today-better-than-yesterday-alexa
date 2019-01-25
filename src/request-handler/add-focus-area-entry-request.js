const addFocusAreaEntry = require('../utils/add-focus-area-entry');
const requestNextFocusAreaEntry = require('./request-next-focus-area-entry');

const INTENTS = { AddFocusAreaEntryNotApplicable: 0, AddFocusAreaEntryBetter: 1, AddFocusAreaEntryWorse: -1 };

module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' && Object.keys(INTENTS).includes(handlerInput.requestEnvelope.request.intent.name);
  },
  async handle(handlerInput) {
    const value = INTENTS[handlerInput.requestEnvelope.request.intent.name];
    const { lastFocusAreaId } = handlerInput.attributesManager.getSessionAttributes();
    await addFocusAreaEntry({ id: lastFocusAreaId, value });
    return requestNextFocusAreaEntry(handlerInput);
  },
};

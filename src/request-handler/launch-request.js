const requestNextFocusAreaEntry = require('./request-next-focus-area-entry');

module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    return requestNextFocusAreaEntry(handlerInput);
  },
};

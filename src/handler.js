const Alexa = require('ask-sdk-core');
const LaunchRequest = require('./request-handler/launch-request');
const AddFocusAreaEntryRequest = require('./request-handler/add-focus-area-entry-request');

const skillBuilder = Alexa.SkillBuilders.custom();

module.exports = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line no-param-reassign
  return skillBuilder
    .addRequestHandlers(
      LaunchRequest,
      AddFocusAreaEntryRequest,
    )
    .addRequestInterceptors({
      process: (handlerInput) => {
        console.log('request', JSON.stringify(handlerInput.requestEnvelope, 0, 2));
      },
    })
    .lambda()(event, context, callback);
};

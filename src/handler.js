const Alexa = require('ask-sdk-core');

const LaunchRequest = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('was better in TDD')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

module.exports = skillBuilder
  .addRequestHandlers(
    LaunchRequest,
  )
  .lambda();

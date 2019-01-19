const Alexa = require('ask-sdk-core');
const loadFocusAreas = require('./load-focus-areas');


const LaunchRequest = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const focusAreas = await loadFocusAreas();

    const { name } = focusAreas[0];
    return handlerInput.responseBuilder
      .speak(`was better in ${name}`)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

module.exports = skillBuilder
  .addRequestHandlers(
    LaunchRequest,
  )
  .lambda();

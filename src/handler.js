const Alexa = require('ask-sdk-core');
const LaunchRequest = require('./request-handler/launch-request');

const skillBuilder = Alexa.SkillBuilders.custom();

module.exports = skillBuilder
  .addRequestHandlers(
    LaunchRequest,
  )
  .lambda();

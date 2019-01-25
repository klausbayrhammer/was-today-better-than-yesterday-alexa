const expect = require('expect');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

function createHandlerInput() {
  const sessionAttributes = {};
  const handlerInput = {
    attributesManager: { sessionAttributes, getSessionAttributes: () => sessionAttributes },
  };
  return handlerInput;
}

describe('add-focus-area-entry-handler.js', () => {
  const addFocusAreaEntry = sinon.stub();
  const requestNextFocusAreaEntry = sinon.stub();
  const { canHandle, handle } = proxyquire('../../src/request-handler/add-focus-area-entry-request', {
    '../utils/add-focus-area-entry': addFocusAreaEntry,
    './request-next-focus-area-entry': requestNextFocusAreaEntry,
  });

  describe('canHandle', () => {
    it('can handle launch requests', () => {
      expect(canHandle({ requestEnvelope: { request: { type: 'IntentRequest', intent: { name: 'AddFocusAreaEntryBetter' } } } })).toEqual(true);
    });
    it('cannot handle other requests', () => {
      expect(canHandle({ requestEnvelope: { request: { type: 'OtherRequest' } } })).toEqual(false);
    });
  });
  describe('handle', () => {
    it('adds focus area entry', async () => {
      const handlerInput = createHandlerInput();
      handlerInput.attributesManager.sessionAttributes.lastFocusAreaId = 'focusAreaId';
      await handle(handlerInput);
      sinon.assert.calledWith(addFocusAreaEntry, { id: 'focusAreaId', value: 1 });
      sinon.assert.calledWith(requestNextFocusAreaEntry, handlerInput);
    });
  });
});

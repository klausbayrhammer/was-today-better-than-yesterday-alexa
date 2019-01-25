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

describe('add-focus-area-entry-request.js', () => {
  const addFocusAreaEntry = sinon.stub();
  const requestNextFocusAreaEntry = sinon.stub();
  const { canHandle, handle } = proxyquire('../../src/request-handler/add-focus-area-entry-request', {
    '../utils/add-focus-area-entry': addFocusAreaEntry,
    './request-next-focus-area-entry': requestNextFocusAreaEntry,
  });

  describe('canHandle', () => {
    ['AddFocusAreaEntryNotApplicable', 'AddFocusAreaEntryBetter', 'AddFocusAreaEntryWorse'].forEach((name) => {
      it(`can handle ${name} requests`, () => {
        expect(canHandle({ requestEnvelope: { request: { type: 'IntentRequest', intent: { name } } } })).toEqual(true);
      });
    });

    it('cannot handle other requests', () => {
      expect(canHandle({ requestEnvelope: { request: { type: 'OtherRequest' } } })).toEqual(false);
    });
  });
  describe('handle', () => {
    [
      { name: 'AddFocusAreaEntryNotApplicable', value: 0 },
      { name: 'AddFocusAreaEntryBetter', value: 1 },
      { name: 'AddFocusAreaEntryWorse', value: -1 },
    ].forEach(({ name, value }) => {
      it(`adds an entry for intent ${name} with value ${value}`, async () => {
        const handlerInput = createHandlerInput();
        handlerInput.requestEnvelope = { request: { type: 'IntentRequest', intent: { name } } };
        handlerInput.attributesManager.sessionAttributes.lastFocusAreaId = 'focusAreaId';
        await handle(handlerInput);
        sinon.assert.calledWith(addFocusAreaEntry, { id: 'focusAreaId', value });
        sinon.assert.calledWith(requestNextFocusAreaEntry, handlerInput);
      });
    });
  });
});

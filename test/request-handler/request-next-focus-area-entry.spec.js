const expect = require('expect');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

function createHandlerInput() {
  const speak = sinon.stub();
  const getResponse = sinon.stub();
  const withShouldEndSession = sinon.stub();
  const sessionAttributes = {};
  const handlerInput = {
    responseBuilder: { speak, getResponse, withShouldEndSession },
    attributesManager: { sessionAttributes, getSessionAttributes: () => sessionAttributes },
  };
  speak.returns(handlerInput.responseBuilder);
  withShouldEndSession.returns(handlerInput.responseBuilder);
  getResponse.returns(handlerInput.responseBuilder);
  return handlerInput;
}

describe('request-next-focus-area-entry.js', () => {
  const focusAreaWithoutTodaysEntryStub = sinon.stub();
  const requestNextFocusAreaEntry = proxyquire('../../src/request-handler/request-next-focus-area-entry',
    { '../utils/focus-area-without-todays-entry': focusAreaWithoutTodaysEntryStub });

  it('ends session if there are no pending entries', async () => {
    focusAreaWithoutTodaysEntryStub.resolves(undefined);
    const handlerInput = createHandlerInput();
    await requestNextFocusAreaEntry(handlerInput);
    sinon.assert.calledWith(handlerInput.responseBuilder.speak, 'You are done for today - you added entries to all focus areas');
    sinon.assert.called(handlerInput.responseBuilder.getResponse);
    sinon.assert.calledWith(handlerInput.responseBuilder.withShouldEndSession, true);
  });
  it('requests the user to enter an entry for the first focus area with no entry today', async () => {
    focusAreaWithoutTodaysEntryStub.resolves({ id: 'focusAreaId', name: 'focusAreaName' });
    const handlerInput = createHandlerInput();
    await requestNextFocusAreaEntry(handlerInput);
    sinon.assert.calledWith(handlerInput.responseBuilder.speak, 'Was today better than yesterday in regards of focusAreaName');
    sinon.assert.called(handlerInput.responseBuilder.getResponse);
    expect(handlerInput.attributesManager.sessionAttributes.lastFocusAreaId).toEqual('focusAreaId');
    sinon.assert.calledWith(handlerInput.responseBuilder.withShouldEndSession, false);
  });
});

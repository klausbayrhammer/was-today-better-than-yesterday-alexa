const expect = require('expect');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

function createHandlerInput() {
  const speak = sinon.stub();
  const getResponse = sinon.stub();
  const withShouldEndSession = sinon.stub();
  const sessionAttributes = { lastFocusAreaId: 'lastFocusAreaId' };
  const handlerInput = {
    responseBuilder: { speak, getResponse, withShouldEndSession },
    attributesManager: { sessionAttributes, getSessionAttributes: () => sessionAttributes },
    requestEnvelope: { request: { locale: 'locale' } },
  };
  speak.returns(handlerInput.responseBuilder);
  withShouldEndSession.returns(handlerInput.responseBuilder);
  getResponse.returns(handlerInput.responseBuilder);
  return handlerInput;
}

describe('request-next-focus-area-entry.js', () => {
  const focusAreaWithoutTodaysEntryStub = sinon.stub();
  const loadStreakForFocusArea = sinon.stub();
  const translations = sinon.stub();
  loadStreakForFocusArea.withArgs('lastFocusAreaId').resolves({ name: 'lastFocusAreName', current: 1, longest: 2 });
  const requestNextFocusAreaEntry = proxyquire('../../src/request-handler/request-next-focus-area-entry',
    {
      '../utils/focus-area-without-todays-entry': focusAreaWithoutTodaysEntryStub,
      '../utils/load-streak-for-focus-area': loadStreakForFocusArea,
      '../translate/translate': translations,
    });

  it('ends session with streak info if there are no pending entries', async () => {
    focusAreaWithoutTodaysEntryStub.resolves(undefined);
    const handlerInput = createHandlerInput();
    translations.withArgs('locale', 'STREAK_AND_DONE_FOR_TODAY', 'lastFocusAreName', 1, 2).returns('speak');
    await requestNextFocusAreaEntry(handlerInput);
    sinon.assert.calledWith(handlerInput.responseBuilder.speak, 'speak');
    sinon.assert.called(handlerInput.responseBuilder.getResponse);
    sinon.assert.calledWith(handlerInput.responseBuilder.withShouldEndSession, true);
  });

  it('requests the user to enter an entry for the first focus area with no entry today', async () => {
    focusAreaWithoutTodaysEntryStub.resolves({ id: 'focusAreaId', name: 'focusAreaName' });
    const handlerInput = createHandlerInput();
    translations.withArgs('locale', 'STREAK_AND_NEXT_FOCUS_AREA', 'lastFocusAreName', 1, 2, 'focusAreaName').returns('speak');
    await requestNextFocusAreaEntry(handlerInput);
    sinon.assert.calledWith(handlerInput.responseBuilder.speak, 'speak');
    sinon.assert.called(handlerInput.responseBuilder.getResponse);
    expect(handlerInput.attributesManager.sessionAttributes.lastFocusAreaId).toEqual('focusAreaId');
    sinon.assert.calledWith(handlerInput.responseBuilder.withShouldEndSession, false);
  });
  it('skips the streak if there is no previous focus area', async () => {
    focusAreaWithoutTodaysEntryStub.resolves({ id: 'focusAreaId', name: 'focusAreaName' });
    const handlerInput = createHandlerInput();
    translations.withArgs('locale', 'NEXT_FOCUS_AREA', 'focusAreaName').returns('speak');
    delete handlerInput.attributesManager.sessionAttributes.lastFocusAreaId;
    await requestNextFocusAreaEntry(handlerInput);
    sinon.assert.calledWith(handlerInput.responseBuilder.speak, 'speak');
  });

  it('ends session without streak info if there are no pending entries and no last focus area id', async () => {
    focusAreaWithoutTodaysEntryStub.resolves(undefined);
    const handlerInput = createHandlerInput();
    translations.withArgs('locale', 'DONE_FOR_TODAY').returns('speak');
    delete handlerInput.attributesManager.sessionAttributes.lastFocusAreaId;
    await requestNextFocusAreaEntry(handlerInput);
    sinon.assert.calledWith(handlerInput.responseBuilder.speak, 'speak');
    sinon.assert.called(handlerInput.responseBuilder.getResponse);
    sinon.assert.calledWith(handlerInput.responseBuilder.withShouldEndSession, true);
  });
});

const expect = require('expect');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

describe('launch request handler', () => {
  const requestNextFocusAreaEntry = sinon.stub();
  const { canHandle, handle } = proxyquire('../../src/request-handler/launch-request',
    { './request-next-focus-area-entry': requestNextFocusAreaEntry });

  describe('canHandle', () => {
    it('can handle launch requests', () => {
      expect(canHandle({ requestEnvelope: { request: { type: 'LaunchRequest' } } })).toEqual(true);
    });
    it('cannot handle other requests', () => {
      expect(canHandle({ requestEnvelope: { request: { type: 'OtherRequest' } } })).toEqual(false);
    });
  });
  describe('handle', () => {
    it('requests the next focus area entry', async () => {
      const handlerInput = sinon.stub();
      await handle(handlerInput);
      sinon.assert.calledWith(requestNextFocusAreaEntry, handlerInput);
    });
  });
});

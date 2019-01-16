const expect = require('expect');
const handler = require('../src/handler');

describe('handler integration test', () => {
  it('resolves the LaunchIntent successfully', (done) => {
    const event = {
      version: '1.0',
      session: {
      },
      request: {
        type: 'LaunchRequest',
      },
    };
    handler(event, {}, (error, response) => {
      try {
        expect(response.response).toEqual({
          outputSpeech: {
            type: 'SSML',
            ssml: '<speak>was better in TDD</speak>',
          },
        });
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});

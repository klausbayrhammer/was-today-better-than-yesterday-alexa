const expect = require('expect');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('translate.js', () => {
  const translationKeys = sinon.stub();
  const translate = proxyquire('../../src/translate/translate', { './translation-keys': translationKeys });

  it('resolves translation keys to translations', async () => {
    translationKeys.returns({ locale: { key: 'translation' } });
    expect(translate('locale', 'key')).toEqual('translation');
  });

  it('substitutes placeholders', async () => {
    translationKeys.returns({ locale: { key: 'key: {0} {1}' } });
    expect(translate('locale', 'key', 'substitute1', 'substitute2')).toEqual('key: substitute1 substitute2');
  });

  it('falls back to en-GB keys if no matching key was found', async () => {
    translationKeys.returns({ 'en-GB': { key: 'gb-translation' } });
    expect(translate('locale', 'key')).toEqual('gb-translation');
  });
});

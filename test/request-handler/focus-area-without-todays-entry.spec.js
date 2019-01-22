const expect = require('expect');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

describe('focus-area-without-todays-entry.js', () => {
  const loadFocusAreas = sinon.stub();
  const focusAreaWithoutTodaysEntry = proxyquire('../../src/utils/focus-area-without-todays-entry',
    { './load-focus-areas': loadFocusAreas });

  it('returns a focus area if it does not hold any entries', async () => {
    loadFocusAreas.resolves({ id: { name: 'name' } });
    expect(await focusAreaWithoutTodaysEntry()).toEqual({ id: 'id', name: 'name' });
  });
  it('ignores focus areas if they are marked as deleted', async () => {
    loadFocusAreas.resolves({ id: { name: 'name', deleted: true } });
    expect(await focusAreaWithoutTodaysEntry()).toEqual(undefined);
  });
  it('returns undefined if there are no focus areas', async () => {
    loadFocusAreas.resolves(undefined);
    expect(await focusAreaWithoutTodaysEntry()).toEqual(undefined);
  });
  it('returns undefined if all focus areas have an entry for today', async () => {
    const entries = {};
    entries[new Date().toISOString().split('T')[0]] = 0;
    loadFocusAreas.resolves({ id: { name: 'name', entries } });
    expect(await focusAreaWithoutTodaysEntry()).toEqual(undefined);
  });

  it('returns a focus area if it does not hold any entries for today', async () => {
    loadFocusAreas.resolves({ id: { name: 'name', entries: { '2018-12-21': 0 } } });
    expect(await focusAreaWithoutTodaysEntry()).toEqual({ id: 'id', name: 'name', entries: { '2018-12-21': 0 } });
  });
});

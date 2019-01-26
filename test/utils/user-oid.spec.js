const expect = require('expect');
const userOid = require('../../src/utils/user-oid');

describe('user-oid.js', () => {
  it('returns the oid of a user given in an ENV', async () => {
    process.env.FIREBASE_USER_OID = 'userOid';

    expect(userOid()).toEqual('userOid');
  });
});

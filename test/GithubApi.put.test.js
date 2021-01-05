require('dotenv').config();
const agent = require('superagent');
const { expect } = require('chai');
const { OK } = require('http-status-codes');

const urlBase = 'https://api.github.com';
const userToFollow = 'aperdomob';
const myUsername = 'luiCham';

describe('consuming PUT services', () => {
  it(`Following user ${userToFollow}`, async () => {
    const response = await agent.put(`${urlBase}/user/following/${userToFollow}`)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'Agent');

    expect(response.status).to.equal(204);
    expect(response.body).to.eql({});
  });

  it(`Verifying user ${userToFollow} is followed`, async () => {
    const response = await agent.get(`${urlBase}/users/${userToFollow}/followers`)
      .query('per_page=100')
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent');

    let me = response.body.find((user) => user.login === myUsername);
    if (me === undefined) {
      me = { login: 'not found' };
    }
    expect(response.status).to.equal(OK);
    expect(me.login).to.equal(myUsername);
  });
});

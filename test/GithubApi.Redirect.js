require('dotenv').config();
const agent = require('superagent');
const { expect } = require('chai');
const { OK } = require('http-status-codes');

describe('Testing redirections', () => {
  let redirectResponse;
  it('verifying redirection and url', async () => {
    await agent.head('https://github.com/aperdomob/redirect-test')
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent')
      .catch((err) => {
        redirectResponse = err;
      });

    expect(redirectResponse.status).to.equal(301);
    expect(redirectResponse.response.header.location).to.equal('https://github.com/aperdomob/new-redirect-test');
  });

  it('getting redirect', async () => {
    const response = await agent.get(redirectResponse.response.header.location)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(OK);
  });
});

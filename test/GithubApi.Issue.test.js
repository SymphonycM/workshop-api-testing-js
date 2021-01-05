const agent = require('superagent');
const { expect } = require('chai');
const { OK } = require('http-status-codes');

const urlBase = 'https://api.github.com';

describe('Testing logged user', () => {
  it('Getting name and ensuring they have at least one public repo', async () => {
    const response = await agent.get(`${urlBase}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    console.log(response.body);
    expect(response.status).to.equal(OK);
  });
});

require('dotenv').config();
const agent = require('superagent');
// @ts-ignore
const responseTime = require('superagent-response-time');
const { expect } = require('chai');
const { OK } = require('http-status-codes');

const urlBase = 'https://api.github.com';
let requestResponseTime;
const callback = (req, time) => {
  requestResponseTime = time;
};

describe('Testing response time', () => {
  it('Getting all users in 5sec', async () => {
    const response = await agent.get(`${urlBase}/users`)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .use(responseTime(callback))
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(OK);
    expect(requestResponseTime).to.be.below(5000);
  });

  it('getting 10 users', async () => {
    const response = await agent.get(`${urlBase}/users`)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .use(responseTime(callback))
      .query('per_page=10')
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(OK);
    expect(response.body.length).to.equal(10);
  });

  it('getting 50 users', async () => {
    const response = await agent.get(`${urlBase}/users`)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .use(responseTime(callback))
      .query('per_page=50')
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(OK);
    expect(response.body.length).to.equal(50);
  });
});

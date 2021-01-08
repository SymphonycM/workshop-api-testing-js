require('dotenv').config();
const agent = require('superagent');
const { expect } = require('chai');
const { OK } = require('http-status-codes');
const chaiSubset = require('chai-subset');
const chai = require('chai');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
let repoFound;
let loggedUser = 'luiCham';
let createdIssue;

describe('Testing logged user', () => {
  it('Getting name and ensuring they have at least one public repo', async () => {
    const response = await agent.get(`${urlBase}/user`)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent');

    loggedUser = response.body.login;
    expect(response.status).to.equal(OK);
    expect(response.body.public_repos).to.be.greaterThan(0);
  });

  it('getting a random repo', async () => {
    const response = await agent.get(`${urlBase}/users/${loggedUser}/repos`)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent');

    const zero = 0;
    repoFound = response.body[zero];
    expect(response.status).to.equal(OK);
  });

  it('verifying repo exists', async () => {
    const response = await agent.get(`${urlBase}/repos/${loggedUser}/${repoFound.name}`)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(OK);
    expect(response.body.name).to.equal(repoFound.name);
  });

  it('creating issue', async () => {
    const response = await agent.post(`${urlBase}/repos/${loggedUser}/${repoFound.name}/issues`, { title: 'created by testing workshop' })
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('Content-Type', 'application/json')
      .set('User-Agent', 'agent');

    createdIssue = response.body;
    expect(response.status).to.equal(201);
    expect(response.body.title).to.equal('created by testing workshop');
    expect(response.body.body).to.equal(null);
  });

  it('Modifying created issue', async () => {
    const response = await agent.patch(`${urlBase}/repos/${loggedUser}/${repoFound.name}/issues/${createdIssue.number}`, { body: 'Body added by PATCH method on workshop-api-test' })
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(OK);
    expect(response.body).to.containSubset({ title: createdIssue.title, body: 'Body added by PATCH method on workshop-api-test' });
  });
});

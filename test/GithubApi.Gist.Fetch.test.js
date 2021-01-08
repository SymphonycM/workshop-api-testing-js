require('dotenv').config();
const agent = require('superagent');
const { expect } = require('chai');
const { OK } = require('http-status-codes');
const chaiSubset = require('chai-subset');
const chai = require('chai');
/* global fetch:false */
require('isomorphic-fetch');

const urlBase = 'https://api.github.com';

chai.use(chaiSubset);

describe('Testing DELETE method with gists', () => {
  let createdGist;
  it('create gist without promise', async () => {
    let response = await fetch(`${urlBase}/gists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        'User-Agent': 'agent'
      },
      body: JSON.stringify({
        files: {
          'test.txt': {
            content: 'Test file'
          }
        },
        description: 'test gist'
      })
    });

    expect(response.status).to.equal(201);
    response = await response.json();
    expect(response.description).to.equal('test gist');
    expect(response.public).to.equal(false);
    expect(response.files).to.not.eql({});
    createdGist = response;
  });

  it('verifying created gist exists', async () => {
    let response = await fetch(createdGist.url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        'User-Agent': 'agent'
      }
    });

    expect(response.status).to.equal(OK);
    response = await response.json();
    expect(response.description).to.equal('test gist');
    expect(response.files).to.not.eql({});
  });

  it('deleting gist', async () => {
    const response = await agent.delete(createdGist.url)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(204);
  });

  it('verifying deleted gist doesn\'t exist anymore', async () => {
    const response = await fetch(createdGist.url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        'User-Agent': 'agent'
      }
    });

    expect(response.status).to.equal(404);
  });
});

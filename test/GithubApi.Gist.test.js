require('dotenv').config();
const agent = require('superagent');
const { expect } = require('chai');
const { OK } = require('http-status-codes');
const chaiSubset = require('chai-subset');
const chai = require('chai');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';

describe('Testing DELETE method with gists', () => {
  let createdGist;
  it('create gist', async () => {
    let response;
    await agent.post(`${urlBase}/gists`, {
      files: {
        'test.txt': {
          content: 'Test file'
        }
      },
      description: 'test gist'
    })
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent')
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        console.error(err);
        response = err;
      });

    expect(response.status).to.equal(201);
    expect(response.body.description).to.equal('test gist');
    expect(response.body.public).to.equal(false);
    expect(response.body.files).to.not.eql({});
    createdGist = response.body;
  });

  it('verifying created gist exists', async () => {
    const response = await agent.get(createdGist.url)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(OK);
    expect(response.body.description).to.equal('test gist');
    expect(response.body.files).to.not.eql({});
  });

  it('deleting gist', async () => {
    const response = await agent.delete(createdGist.url)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(204);
  });

  it('verifying deleted gist doesn\'t exist anymore', async () => {
    let errorResponse;
    await agent.get(createdGist.url)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent')
      .catch((err) => {
        errorResponse = err;
      });

    expect(errorResponse.status).to.equal(404);
  });
});

// CREATE GIST IN A PROMISE

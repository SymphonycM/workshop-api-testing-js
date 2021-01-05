const agent = require('superagent');
const chai = require('chai');
const { expect } = require('chai');
const { OK } = require('http-status-codes');
const fs = require('fs');
const md5 = require('md5');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const userTest = 'aperdomob';
const repoTest = 'jasmine-awesome-report';
const urlBase = 'https://api.github.com';
const fileTest = 'README.md';

describe('Testing GET user from Github API', () => {
  let repo;
  it(`Getting user ${userTest} from Github API`, async () => {
    const response = await agent.get(`${urlBase}/users/${userTest}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(OK);
    expect(response.body.name).to.equal('Alejandro Perdomo');
    expect(response.body.company).to.equal('PSL');
    expect(response.body.location).to.equal('Colombia');
  });

  it(`getting repo ${repoTest} from user ${userTest}`, async () => {
    const response = await agent.get(`${urlBase}/users/${userTest}/repos`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    repo = response.body.find((repository) => repository.name === repoTest);

    expect(response.status).to.equal(OK);
    expect(repo.name).to.be.eql(repoTest);
    expect(repo.description).to.eql('An awesome html report for Jasmine');
    expect(repo.private).to.eql(false);
  });

  it(`Downloading repo ${repoTest}`, async () => {
    let downloadedCode;
    await agent.get(`${repo.svn_url}/archive/${repo.default_branch}.zip`)
      .pipe(fs.createWriteStream(`${repoTest}.zip`))
      .on('error', () => {
        console.error('Didn\'t save repo');
      });

    fs.readFile('jasmine-awesome-report.zip', (err, buf) => {
      downloadedCode = md5(buf);
    });

    const response2 = await agent.get(`${repo.svn_url}/archive/${repo.default_branch}.zip`);
    const getCode = md5(response2.body);
    expect(downloadedCode).to.equal(getCode);
  });

  it(`Getting ${fileTest} file on repo`, async () => {
    const response = await agent.get(`${urlBase}/repos/${userTest}/${repoTest}/contents/`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    const file = response.body.find((element) => element.name === fileTest);
    expect(response.status).to.equal(OK);
    expect(file).to.containSubset({ name: fileTest, path: fileTest, sha: 'b9900ca9b34077fe6a8f2aaa37a173824fa9751d' });
  });
});

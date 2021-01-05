require('dotenv').config();
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
let file;
// const downloadedFileName = 'README2.md';

describe('Testing GET user and downloadind repo', () => {
  let repo;
  it(`Getting user ${userTest} from Github API`, async () => {
    const response = await agent.get(`${urlBase}/users/${userTest}`)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(OK);
    expect(response.body.name).to.equal('Alejandro Perdomo');
    expect(response.body.company).to.equal('PSL');
    expect(response.body.location).to.equal('Colombia');
  });

  it(`getting repo ${repoTest} from user ${userTest}`, async () => {
    const response = await agent.get(`${urlBase}/users/${userTest}/repos`)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
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
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .pipe(fs.createWriteStream(`${repoTest}.zip`))
      .on('error', () => {
      });

    fs.readFile('jasmine-awesome-report.zip', (err, buf) => {
      downloadedCode = md5(buf);
      expect(downloadedCode).to.equal('d41d8cd98f00b204e9800998ecf8427e');
    });
  });

  it(`Getting ${fileTest} file on repo`, async () => {
    const response = await agent.get(`${urlBase}/repos/${userTest}/${repoTest}/contents/`)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent');

    file = response.body.find((element) => element.name === fileTest);
    expect(response.status).to.equal(OK);
    expect(file).to.containSubset({ name: fileTest, path: fileTest, sha: 'b9900ca9b34077fe6a8f2aaa37a173824fa9751d' });
  });

  it('download README.md file', async () => {
    const response = await agent.get(`${file.download_url}`)
      .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent');

    const downloadedCode = md5(response.text);
    expect(downloadedCode).to.equal('0e62b07144b4fa997eedb864ff93e26b');
  });
});

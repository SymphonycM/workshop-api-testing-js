const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const { OK, CONTINUE } = require('http-status-codes');

const expect = chai.expect;


describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await agent.get('https://httpbin.org/ip');
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };
      
    const response = await agent.get('https://httpbin.org/get').query(query);
      
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args).to.eql(query);
  });

  it('Consume DELETE service', async ()=>{
    const response = await agent.delete('https://httpbin.org/delete');
    expect(response.status).to.equal(OK);
    expect(response.body).to.have.property('origin');
  });
    
  it('Consume PATCH service', async ()=>{
    const response = await agent.patch('https://httpbin.org/patch');
    expect(response.status).to.equal(OK);
    expect(response.body).to.have.property('origin');
  });
  
  it('Consume PUT service', async ()=>{
    const response = await agent.put('https://httpbin.org/put');
    expect(response.status).to.equal(OK);
    expect(response.body).to.have.property('origin');
  });
  
  it('Consume HEAD service on GET url', async ()=>{
    const response = await agent.head('https://httpbin.org/get');
    expect(response.status).to.equal(OK);
    expect(response.body).to.be.empty;
  });

  it('Consume POST service with form', async ()=>{
    const response = await agent.post('https://httpbin.org/post')
    .field("comments","asasas")
    .field("custemail","asdasdas@asd.com")
    .field("custname","Juanito")
    .field("custtel","3434343")
    .field("delivery","14:45")
    .field("size","small")
    .field("topping",["bacon","cheese"]);

    expect(response.status).to.equal(OK);
    expect(response.body.form.custemail).to.equal("asdasdas@asd.com");
    expect(response.body.form.comments).to.equal("asasas");
    expect(response.body.form.topping[0]).to.equal("bacon");
  });

  it('Consume GET service with Json document response', async ()=>{
    const response = await agent.get('https://httpbin.org/json');
    expect(response.status).to.equal(OK);
    expect(response.type).to.equal("application/json");
  });
  
  it('Consume GET service with HTML response', async ()=>{
    const response = await agent.get('https://httpbin.org/html');
    expect(response.statusCode).to.equal(OK);
    expect(response.type).to.equal("text/html");
  });
  
  it('Recieve PNG image using GET service', async ()=>{
    const response=await agent.get('https://httpbin.org/image/png');
    
    expect(response.type).to.equal("image/png");
    expect(response.status).to.equal(200);
  });
  
});
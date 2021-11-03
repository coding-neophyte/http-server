const parseBody = require('../lib/parseBody.js');
const EventEmitter = require('events');

describe('parse-body', () => {
  it('should return null if method is invalid', async () => {
    expect(await parseBody({ method: 'GET' })).toEqual(null);
    expect(await parseBody({ method: 'DELETE' })).toEqual(null);


  });

  it('throws if content-type is not application/json', async () => {

    const req = {
      method: 'POST',
      headers: {
        'content-type': 'text/plain'
      }
    };
    expect.assertions(1);
    try{
      await parseBody(req);
    } catch (err){
      expect(err).toEqual('invalid content type, content must be application/json');
    }

  });

  it('returns deserialized body from req emitted events', async () => {
    const req = new EventEmitter();
    req.headers = { 'content-type': 'application/json' };
    req.method = 'POST';
    const reqParse = parseBody(req);

    req.emit('data', `{ "name":`);
    req.emit('data', ` "john" }`);
    req.emit('end');

    const body = await reqParse;

    expect(body).toEqual({ name: 'john' });

  });

  it('throws if failure happens in deserialization', async () => {
    const req = new EventEmitter();
    req.headers = { 'content-type': 'application/json' };
    req.method = 'POST';
    const reqParse = parseBody(req);

    req.emit('data', '{"not json"}');
    req.emit ('end');


    expect.assertions(1);
    try{
      await reqParse;
    } catch (err){
      expect(err).toEqual('invalid json');
    }


  });

});

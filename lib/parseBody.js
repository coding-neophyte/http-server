const validMethod = ['PUT', 'POST', 'PATCH'];

const parseBody = async (req) => {
  if (!validMethod.includes(req.method)){
    return null;
  }

  return new Promise((resolve, reject) => {
    if (req.headers['content-type'] !== 'application/json'){
      reject('invalid content type, content must be application/json');
      return;
    }
    let data = '';

    req.on('data', (chunk) => {
       return data += chunk;
    });
    req.on('end', async () => {
      try {
        resolve(JSON.parse(data));
      } catch (err){
        reject('invalid json');
      }
    });

  });


};

module.exports = parseBody;

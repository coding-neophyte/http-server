const request = require('supertest');
const app = require('../lib/app.js');

describe('post', () => {
  it('should post new book', async () => {
    const book = { name: 'laws of human nature', author: 'robert greene', price: 20.00  };
    const res = await request(app).post('/book').send(book);

    expect(res.body).toEqual({ id: expect.any(String), name: 'laws of human nature', author: 'robert greene', price: 20.00  });

  });
});

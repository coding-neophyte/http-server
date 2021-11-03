const request = require('supertest');
const app = require('../lib/app.js');
const { rm, mkdir } = require('fs/promises');
const SimpleDB = require('../lib/SimpleDB.js');

const rootDir = `${__dirname}/store`;

describe('books api', () => {
  beforeEach(() => {
    return rm(rootDir, { force: true, recursive: true }).then(() =>
      mkdir(rootDir, { recursive: true })
    );
  });

  afterAll(() => {
    return rm(rootDir, { force: true, recursive: true }).then(() =>
      mkdir(rootDir, { recursive: true })
    );
  });

  it('should post new book', async () => {
    const newBook = { name: 'laws of human nature', author: 'robert greene', price: 20.00  };
    const res = await request(app).post('/books').send(newBook);

    expect(res.body).toEqual({ id: expect.any(String), name: 'laws of human nature', author: 'robert greene', price: 20.00  });

  });

  it('should get book by id', async () => {
    const book = {  name: 'laws of human nature', author: 'robert greene', price: 20.00  };
    const postedBook = await request(app).post('/books').send(book);

    const res = await request(app).get(`/books/${postedBook.body.id}`);

    expect(res.body).toEqual({ ...book, id: expect.any(String) });
  });

  it('should get all book', async () => {
    const thinkBook = { name: 'think slow and fast', author: 'daniel kahneman', price: 25.00 };
    await request(app).post('/books').send(thinkBook);
    const assata = { name: 'assata', author: 'assata shakur', price: 20.00 };
    await request(app).post('/books').send(assata);
    const lawBook = { name: 'color of law', author: 'richard rothstein', price: 15.00 };
    await request(app).post('/books').send(lawBook);
    const res = await request(app).get('/books');

    expect(res.body).toEqual(expect.arrayContaining([{ id: expect.any(String), ...thinkBook }, { id: expect.any(String), ...assata }, { id: expect.any(String), ...lawBook }]));

  });

  it('should update book', async () => {
    const assata = { name: 'assata', author: 'assata shakur', price: 20.00 };
    const postAssata = await request(app).post('/books').send(assata);
    const res = await request(app).put(`/books/${postAssata.body.id}`).send({ id: `${postAssata.body.id}`, name: 'assata', author: 'assata shakur', price: 25.00 });


    expect(res.body).toEqual({ id: expect.any(String), name: 'assata', author: 'assata shakur', price: 25.00 });
  });

  it('deletes book', async () => {

    const lawBook = { name: 'color of law', author: 'richard rothstein', price: 15.00 };
    const law = await request(app).post('/books').send(lawBook);
    await request(app).delete(`/books/${law.body.id}`);
    const res = await request(app).get(`/books/${law.body.id}`);
    expect(res.body).toEqual(null);

  });

});

const parseBody = require('./parseBody.js');
const SimpleDB = require('./SimpleDB.js');

const newDB = new SimpleDB('/store/books');

const booksRouter = {
  async post(req, res){
    const book = await parseBody(req);
    await newDB.save(book);
    const savedBook = await newDB.get(book.id);

    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(savedBook));

  },
  async get(req, res){
    const [, , id] = req.url.split('/');

    if(id){
      const oneBook = await newDB.get(id);
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(oneBook));

    } else {
      const allBooks = await newDB.getAll();
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(allBooks));
    }



  },

  async put(req, res){
    const [, , id] = req.url.split('/');
    const updateBook = await newDB.update(id);
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(updateBook));
  },

  async delete(req, res){
    const [, , id] = req.url.split('/');
    const deleteBook = await newDB.delete(id);
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(deleteBook));
  }


};


module.exports = booksRouter;

const bookRouter = require('./books.js');

const routes = {
  books: bookRouter
};

const app = async (req, res) => {

  const [, path] = req.url.split('/');
  const route = routes[path];

  if (route){

    try {
      const handleRoute = route[req.method.toLowerCase()];
      await handleRoute(req, res);

    } catch(err) {
      res.statusCode = 500;
      res.end(err.message);
    }
  }  else {
    res.statusCode = 404;
    res.end('Not found');
  }

};


module.exports = app;

const http = require('http');

const port = process.env.PORT || 7890;

const server = http.createServer((app) => {

});

server.listen(port, () => {
  console.log(`Server running at port http://localhost:${port}`);
});

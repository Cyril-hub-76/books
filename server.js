// http queries
const http = require("http");

const app = require("./app");

const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };
  const port = normalizePort(process.env.PORT || '4000');
  app.set('port', port);
  
  const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

// server creation which haddles our app
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;

});

// listening server
server.listen(port);


/**
 * packages needed for this project
 * ( --save to add to package.json | --force to force install )
 * 
 * To ensure server realtime updating we need the nodemon package
 * npm install -g nodemon
 * 
 * To create the express app we install the express package
 * npm install express --save
 * 
 * To handle MongoDb database communication
 * npm install mongoose
 * 
 * To hash passwords we need bcrypt package
 * npm install bcrypt
 * 
 * To handle errors unique validation we need mongoose-unique-validator
 * npm install --save mongoose-unique-validator
 * 
 * To create & check token for authentication
 * npm install --save jsonwebtoken
 * 
 * To upload Pictures we need the multer package
 * npm install --save multer
 * 
 * To handle pictures compression we install the sharp package
 * npm install sharp --save
 */
var path = require('path'),  
    express = require('express'), 
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    listingsRouter = require('../routes/listings.server.routes');

module.exports.init = function() {


  //connect to database
  mongoose.connect(config.db.uri);

  //initialize app
  var app = express();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);

  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('priceUpdate', function(data){
      console.log(data);
    });
    socket.on('listingAdded', function(data){
      console.log(data);
      socket.broadcast.emit('listingAdded', data);
    });
  });

  //enable request logging for development debugging
  app.use(morgan('dev'));

  //body parsing middleware 
  app.use(bodyParser.json());

  
  /**Serve static files */

  app.use('/', express.static(__dirname + '/../../client'));
  app.use('/public', express.static(__dirname + '/../../public'));
  app.use('/scripts', express.static(__dirname + '/../../node_modules'));

  /**Use the listings router for requests to the api */
  app.use('/api/listings', listingsRouter);

  app.get('/home', function(req, res) {
    res.sendFile(path.resolve('client/home.html'));
  });
    app.get('/test', function(req, res) {
        res.sendFile(path.resolve('client/test.html'));
    });

  /**Go to homepage for all routes not specified */ 
  app.all('/*', function(req, res) {
    res.sendFile(path.resolve('client/index.html'));
  });

  return http;
};  
var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    listingsRouter = require('../routes/listings.server.routes');
    var Listing = require('../models/listings.server.model.js');

module.exports.init = function() {


  //connect to database
  mongoose.connect(config.db.uri);

  //initialize app
  var app = express();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);
  function checkTimes(){
    console.log("Check Times");
    // Listings.find().then(function(response) {
      var currentTime = new Date();
    //   listings.map(listing => {
    //     if (listing.updated_at - currentTime >= 1 && listing.price > listing.original) {
    //       listing.price -= .10
    //       listing.price = parseFloat(listing.price.toFixed(2));
    //       console.log(listing);
    //     }
    //     else {
    //       console.log(listing);
    //       console.log(listing.updated_at - currentTime);
    //     }
    //   }
    //   );
    // }, function(error) {
    //   console.log('Unable to retrieve listings:', error);
    // });

  Listing.find().exec(function(err, listings) {
    if (err){
    } else {
      listings.map(listing => {
        if (currentTime - listing.updated_at >= 300000 && listing.price > listing.original) {
          listing.price -= .10
          listing.price = parseFloat(listing.price.toFixed(2));
          listing.diff = listing.price - listing.original;
          listing.diff = parseFloat(listing.diff.toFixed(2));

          listing.save(function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Updated the price");
              io.emit('listingUpdated', listing);

            }
          });
        }
        else {
          console.log(currentTime - listing.updated_at);
        }
      }
      );
    }
  });
}

setInterval(checkTimes, 300000);

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
    socket.on('listingDeleted', function(data){
      console.log(data);
      socket.broadcast.emit('listingDeleted', data);
    });
    socket.on('listingUpdated', function(data){
      console.log(data);
      socket.broadcast.emit('listingUpdated', data);
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

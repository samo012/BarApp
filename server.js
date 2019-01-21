var app = require('./server/config/app');
var Listing = require('./server/models/listings.server.model.js');
var server = app.start();

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
      console.log(listings);
      listings.map(listing => {
        if (currentTime - listing.updated_at >= 1 && listing.price > listing.original) {
          listing.price -= .10
          listing.price = parseFloat(listing.price.toFixed(2));
          listing.diff = listing.price - listing.original;
          listing.diff = parseFloat(listing.diff.toFixed(2));

          listing.save(function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Updated the price");
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

//setInterval(checkTimes, 3000);


angular.module('listings').controller('ListingsController', ['$scope', 'Listings',
  function($scope, Listings) {
    Listings.getAll().then(function(response) {
      $scope.listings = response.data;
    }, function(error) {
      console.log('Unable to retrieve listings:', error);
    });

    $scope.detailedInfo = undefined;
    $scope.newListing = undefined;

    $scope.addListing = function() {

          Listings.create($scope.newListing).then(function(response) {
              $scope.listings.push($scope.newListing);
         console.log('Listing Added');
            }, function(error) {
              console.log('Unable to add listing:', error);
          });

        };


    $scope.deleteListing = function(index) {
      var id = $scope.listings[index]._id;
      Listings.delete(id).then(function(response) {
        $scope.listings.splice(index, 1);
         console.log('Listing Deleted');
      }, function(error) {
              console.log('Unable to delete listing:', error);
          });

    };
    $scope.incr = function(index){
      var num = $scope.listings[index].sold;
      var inum = num + 1;
      $scope.listings[index].sold = inum;
      Listings.update();
    }

    $scope.showDetails = function(index) {
      $scope.detailedInfo = $scope.listings[index];
    };

  }
  ]);

angular.module('admin').controller('ListingsController', ['$scope', 'Listings', 'socket',
	function($scope, Listings, socket) {

		console.log(socket.hello);
		Listings.getAll().then(function(response) {
			$scope.listings = response.data;
		}, function(error) {
			console.log('Unable to retrieve listings:', error);
		});

		$scope.detailedInfo = undefined;
		$scope.newListing = undefined;

		$scope.addListing = function() {
			Listings.create($scope.newListing).then(function(response) {
				console.log(response);
				$scope.newListing.sold = 0;
				$scope.newListing.diff = 0;
				$scope.newListing.original = $scope.newListing.price;
				$scope.listings.push(response.data);

				console.log('Listing Added');
				socket.emit('listingAdded', $scope.newListing);
				$scope.newListing = {};
			}, function(error) {
				console.log('Unable to add listing:', error);
			});
		};
		//if a listing was added... push to the list
		socket.on('listingAdded', function(data){$scope.listings.push(data)});
		$scope.deleteListing = function(index) {
			var id = $scope.listings[index]._id;
			console.log($scope.listings[index]);
			Listings.delete(id).then(function(response) {
				$scope.listings.splice(index, 1);
				console.log('Listing Deleted');
				socket.emit('listingDeleted', {i: id});
			}, function(error) {
				console.log('Unable to delete listing:', error);
			});
		};
		socket.on('listingDeleted', function(item) {
            console.log("Listing Deletion");
            $scope.listings.splice($scope.listings.findIndex(listing => listing._id === item.i), 1);
        });

		$scope.incr = function(index){
			var id = $scope.listings[index]._id;
			Listings.update(id).then(function(response) {

				/*var sold = $scope.listings[index].sold;
				var original = $scope.listings[index].original;
				var price = $scope.listings[index].price;
				var num = sold + 1;
				var diff = price - original;

				if (sold%5===0){
					$scope.listings[index].price += 0.10;
				}
        */
        //CHECK THIS
                $scope.listings.splice($scope.listings.findIndex(listing => listing._id === response.data._id), 1, response.data);
                socket.emit('listingUpdated', response.data);
				console.log('Drink Updated');
        // $scope.listings[index].sold = num;
        // $scope.listings[index].diff = parseFloat(diff.toFixed(2));

			}, function(error) {
				console.log('Unable to update listing:', error);
			});
		};
		socket.on('listingUpdated', function(item){
            $scope.listings.splice($scope.listings.findIndex(listing => listing._id === item._id), 1, item);
		});
		$scope.showDetails = function(index) {
			$scope.detailedInfo = $scope.listings[index];
		};

  }

  ]);

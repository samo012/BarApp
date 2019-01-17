

angular.module('listings', []).factory('Listings', function($http) {
  var methods = {
    getAll: function() {
    	return $http.get('/api/listings');
    },
    //https://bar-app.herokuapp.com
	
	create: function(listing) {
		return $http.post('/api/listings', listing);
    }, 

    delete: function(id) {
    	return $http.delete('/api/listings/' + id);
    },

    update: function(id) {
    	return $http.put('/api/listings/' + id);
    }
  };

  return methods;
});

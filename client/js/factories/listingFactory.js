

angular.module('listings', []).factory('Listings', function($http) {
  var methods = {
    getAll: function() {
    	return $http.get('https://localhost:8080/api/listings');
    },
    //https://bar-app.herokuapp.com
	
	create: function(listing) {
		return $http.post('https://localhost:8080/api/listings', listing);
    }, 

    delete: function(id) {
    	return $http.delete('https://localhost:8080/api/listings/' + id);
    },

    update: function(id) {
    	return $http.put('https://localhost:8080/api/listings/' + id);
    }
  };

  return methods;
});

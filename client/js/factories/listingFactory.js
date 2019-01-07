

angular.module('listings', []).factory('Listings', function($http) {
  var methods = {
    getAll: function() {
      return $http.get('https://bar-app.herokuapp.com/api/listings');
    },
	
	create: function(listing) {
    return $http.post('https://bar-app.herokuapp.com/api/listings', listing);
    }, 

    delete: function(id) {
      return $http.delete('https://bar-app.herokuapp.com/api/listings/' + id);
    }
  };

  return methods;
});

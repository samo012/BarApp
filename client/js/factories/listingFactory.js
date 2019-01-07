

angular.module('listings', []).factory('Listings', function($http) {
  var methods = {
    getAll: function() {
      return $http.get('https://uf-directory-app-samole.herokuapp.com/api/listings');
    },
	
	create: function(listing) {
    return $http.post('https://uf-directory-app-samole.herokuapp.com/api/listings', listing);
    }, 

    delete: function(id) {
      return $http.delete('https://uf-directory-app-samole.herokuapp.com/api/listings/' + id);
    }
  };

  return methods;
});

'use strict';

/**
 * Search controller
 */
angular.module('flickrAngularApp').controller('searchCtrl',
	function(photoService, $scope) {

		$scope.searchText = '';

		$scope.searchInFlickr = function() {
			
			photoService.setSearchText($scope.searchText);

		};

	});
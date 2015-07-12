'use strict';

/**
 * @ngdoc function
 * @name flickrAngularApp.controller:MainCtrl
 * @description # MainCtrl Controller of the flickrAngularApp
 */
angular.module('flickrAngularApp').controller('MainCtrl',
	function(photoService, $scope, $timeout) {

		var updateSearchTextListener = function() {
			// $scope.searchText = photoService.searchText;
			
			photoService.query().then(function(photos) {
				$scope.data = photos;
				boardcastUpdatePhotoInfo();
			});
		
		};

		// inform other components, photos need to be updated
		var boardcastUpdatePhotoInfo = function() {
			$timeout(function() {
				$scope.$broadcast('updatePhotos');
			});
		};

		$scope.data = {'test':'test'};

		$scope.searchText = photoService.searchText;

		photoService.query().then(function(photos) {
			$scope.data = photos;
			boardcastUpdatePhotoInfo();
		});

		photoService.registerObserverCallback(updateSearchTextListener);

	});
'use strict';

/**
 * @ngdoc overview
 * @name flickrAngularApp
 * @description # flickrAngularApp Main module of the application.
 */
angular.module(

	// app name
	'flickrAngularApp',

	// included modules
	[ 
	  'ngRoute', 
	  'photoService', 
	  'd3Chart',
	  'd3TagTree',
	  'ngDialog',
	])

	.config(function($routeProvider, $locationProvider) {

		$routeProvider.when('/', {
		templateUrl : 'views/main.html',
		controller : 'MainCtrl'
		}).otherwise({
		redirectTo : '/'
		});

	    	// use the HTML5 History API
		$locationProvider.html5Mode(true);

	});
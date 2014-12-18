'use strict';

angular.module('photoService', ['underscore'])

.constant(

		'flickrInfo', {
			'apiKey': 'b4274825d21adf6163d8dc7a090c3174',
			'url': 'https://api.flickr.com/services/rest/',
			'getSearchMethod': 'flickr.photos.search',
			'getRecentMethod': 'flickr.photos.getRecent',
			'getPhotoInfo': 'flickr.photos.getInfo'
		}
	)
	.service('photoService', ['flickrInfo', '$http', '$q', '_', function(flickrInfo, $http, $q, _) {

		var observerCallbacks = [],
			tagObserverCallbacks = [];

		return {

			searchText: '',

			tags: [],

			tagImgInfo: {
				'title': '',
				'image': ''
			},

			params: {
				'api_key': flickrInfo.apiKey,
				'text': '',
				'per_page': 15,
				'format': 'json',
				'page': 1,
				'jsoncallback': 'JSON_CALLBACK'
			},

			getDetail: function(photoId, photoSecret, thmubnail) {

				var deferred = $q.defer(),

					getInfoParams = {
						'method': flickrInfo.getPhotoInfo,
						'api_key': flickrInfo.apiKey,
						'photo_id': photoId,
						'secret': photoSecret,
						'format': 'json',
						'jsoncallback': 'JSON_CALLBACK'
					},
					that = this;

				$http.jsonp(flickrInfo.url, {

					'params': getInfoParams

				}).success(function(data) {

					if (data.stat === 'ok') {
						if (data.photo.tags.tag.length > 0) {
							var tags = _.map(data.photo.tags.tag, function(tag) {
								return {

									'name': tag.raw,
									'size': 1000

								};
							});

							that.tagImgInfo.title = data.photo._content;
							that.tagImgInfo.image = thmubnail;

							deferred.resolve(tags);
						}
					}
				}).error(function(data, status) {
		           		console.log(data);
					console.log(status);
			       	});    


				deferred.promise.then(function(data) {
					if (typeof data !== 'undefined') {
						that.tags = data;
						that.notifyTagObservers();
					}

				});
			},

			query: function() {

				var deferred = $q.defer();

				if (this.searchText.length > 0) {
					this.params.method = flickrInfo.getSearchMethod;
					this.params.text = this.searchText;
				} else {
					this.params.method = flickrInfo.getRecentMethod;
				}

				$http.jsonp(flickrInfo.url, {

					'params': this.params

				}).success(function(data) {
					if (data.stat === 'ok') {
						// var photos = _.map(data.photos.photo, function(photo) {
						// 	return {
						// 		'title': photo.title,
						// 		'photoId': photo.id,
						// 		'photoSecret': photo.secret,
						// 		'thumb': 'http://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_s.jpg',
						// 		'src': 'http://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg'
						// 	};
						// });

						var photos = [];
						angular.forEach(data.photos.photo, function(photo){
							photos.push({
								'title': photo.title,
								'photoId': photo.id,
								'photoSecret': photo.secret,
								'thumb': 'http://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_s.jpg',
								'src': 'http://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg'

							});
						}, photos);						

						deferred.resolve(photos);
					}
				});

				return deferred.promise;
			},

			setSearchText: function(search) {
				this.searchText = search;
				this.notifyObservers();
			},

			registerObserverCallback: function(callback) {
				observerCallbacks.push(callback);
			},

			notifyObservers: function() {
				angular.forEach(observerCallbacks, function(callback) {
					callback();
				});
			},

			registerTagObserverCallback: function(callback) {
				tagObserverCallbacks.push(callback);
			},

			notifyTagObservers: function() {
				angular.forEach(tagObserverCallbacks, function(callback) {
					callback();
				});
			},

		};

	}]);
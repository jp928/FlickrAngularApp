'use strict';

angular.module('d3Chart', ['d3', 'ngDialog', 'photoService']).directive(
	'd3Chart', [

		'd3Service',
		'ngDialog',
		'photoService',

		function(d3Service, ngDialog, photoService) {
			return {

				restrict: 'A',

				scope: {
					data: '='
				},

				link: function($scope, $ele) {

					$scope.selectedPhoto = {};

					d3Service.d3().then(function(d3) {

						var vis, w = 960, h = 430;

						/**
						 * Matrix Layout
						 */
						var Matrix = function() {

							var width = 1, height = 1;

							// Simple matrix layout algorithm
							// Computes a suitable column count to fit the
							// matrix
							// dimensions (width x height)
							function computeCols(n, width, height) {
								var cols = 1, // number of cols
									a, // edge length
									rows; // number of rows

								while (true) {
									a = width / cols;
									rows = Math.ceil(n / cols);
									if (rows * a <= height && n * a * a <= width * height) {
										return cols;
									} else {
										cols += 1;
									}
								}
							}

							function matrix(data) {
								var cols = computeCols(data.length, width,
									height);
								var size = Math.floor(width / cols);
								data.forEach(function(d, i) {
									d.x = parseInt((i % cols) * size, 10);
									d.y = Math.floor(i / cols) * size;
									d.dx = size;
									d.dy = size;
								});
								return data;
							}

							matrix.size = function(w, h) {
								width = w;
								height = h;
								return matrix;
							};

							return matrix;
						};

						/**
						 * Matrix Plot
						 */
						var MatrixPlot = function() {
							var matrix, cells, collection;

							function init() {
								vis = d3.select($ele[0]).append('svg:svg').attr('width', w).attr('height', h);

								matrix = new Matrix().size(700, 500);
							}

							function cell() {

								this.attr('x', function(d) {
									return d.x;
								}).attr('y', function(d) {
									return d.y;
								}).attr('width', function(d) {
									return d.dx - 5;
								}).attr('height', function(d) {
									return d.dy - 5;
								});
							}

							function update(options) {

								collection = options.collection;

								init();

								cells = vis.data([collection.items()]).selectAll('image').data(matrix);

								// Transition of new (arriving cells)
								cells.enter().append('image')

								.attr(
									'xlink:href',

									function(data) {

										return data[0].thumb;

								}).attr('x', function() {

									return 0;

								}).attr(

									'class', 'thumb'

								).attr('y', function() {

									return 0;

								}).attr('width', function() {
									
									return 0;
								
								}).attr('height', function() {

									return 0;

								}).transition().delay(function(d, i) {

									return i * 20;

								}).duration(1500).call(cell).each('end', function(){
									
									d3.select(this).on('click', function(d) {

										$scope.selectedPhoto = d[0];

										ngDialog.open({
											template: '../views/dialog.html',
											scope: $scope,
											className: 'ngdialog-theme-plain'
										});

									}).on('mouseover', function(d) {

										d3.select(this).transition().ease('cubic-out').duration('200').attr('width', 150).attr('height', 150);

										photoService.getDetail(d[0].photoId, d[0].photoSecret, d[0].thumb);
										
									}).on('mouseout', function() {
										d3.select(this).transition().ease('cubic-out').duration('200').attr('width', 135).attr('height', 135);
									});
									
								});

							}

							return {
								update: update
							};
						};

						$scope.$on('updatePhotos', function() {

							var n = 0; 

							if ($ele.find('.thumb').length > 0) {
								d3.selectAll('.thumb').transition().delay(function(d, i) {
										return i * 20;
									}).duration(1500).attr('x', function() {
										return -400;
									}).attr('y', function() {
										return -400;
									}).remove().each(function() {

										d3.select(this).on('mouseout',null);
										d3.select(this).on('mouseover', null);
										d3.select(this).on('click', null);


										++n;
									}).each('end', function() {
										if (!--n) {
											d3.select('svg').remove();
											$scope.render();	
										}
									});
							} else {
								$scope.render();
							}
						});

						$scope.render = function() {
							
							var plot = new MatrixPlot();

							plot.update({
								collection: {
									items: function() {
										return d3.zip($scope.data);
									}
								}
							});

						}; // end of scope render

					}); //end of d3 function
				}
			};
		}
	]);
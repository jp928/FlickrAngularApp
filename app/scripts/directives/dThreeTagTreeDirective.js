'use strict';

angular.module('d3TagTree', ['d3', 'photoService']).directive(
	'd3TagTree', [

		'd3Service',
		'photoService',

		function(d3Service, photoService) {
			return {

				restrict: 'A',

				transclude: true,

				template: '<div id="tag-tree"></div>',

				link: function() {

					d3Service.d3().then(function(d3) {


						var TagTree = function() {

							var w = 460,
								h = 350,
								node,
								path,
								root;

							var force, vis, thumb;

							function update() {
								var nodes = flatten(root),
									links = d3.layout.tree().links(nodes);

								// Restart the force layout.
								force.nodes(nodes)
									.links(links)
									.linkDistance(120)
									.charge(-500)
									.start();

								path = vis.selectAll('path.link');
								path = path.data(force.links());
								path.enter().append('svg:path')
									.attr('class', 'link')
									.attr('marker-end', 'url(#end)');

								path.exit().remove();
								node = vis.selectAll('.node');
								node = node.data(force.nodes());
								node.enter().append('g')
									.attr('class', 'node')
									.on('click', click)
									.call(force.drag);



								node.append('image')
									.attr('xlink:href', function() {
										return thumb;
									})
									.attr('class', 'image')
									.attr('x', -15)
									.attr('y', -15)
									.attr('width', 24)
									.attr('height', 24);


								node.append('text')
									.attr('class', 'text')
									.attr('x', 40)
									.attr('dy', '.35em')
									.style('fill', color)
									.text(function(d) {
										return d.name;
									});

								node.exit().remove();
							}

							function tick() {
								path.attr('d', function(d) {

									var dx = d.target.x - d.source.x,
										dy = d.target.y - d.source.y,
										dr = Math.sqrt(dx * dx + dy * dy);
									return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y;
								});

								node.attr('transform', function(d) {
									return 'translate(' + d.x + ',' + d.y + ')';
								});

							}

							function color(d) {
								return d._children ? '#3182bd' : d.children ? '#c6dbef' : '#fd8d3c';
							}

							function click(d) {
								if (d.children) {
									d._children = d.children;
									d.children = null;
								} else {
									d.children = d._children;
									d._children = null;
								}
								update();
							}

							// Returns a list of all nodes under the root.
							function flatten(root) {
								var nodes = [],
									i = 0;

								function recurse(node) {
									if (node.children) {
										node.children.forEach(recurse);
									}

									if (!node.id) {
										node.id = ++i;
									}

									nodes.push(node);
								}

								recurse(root);
								return nodes;
							}

							function loadTagTree() {

								thumb = photoService.tagImgInfo.image;
								root = {
									'name': photoService.tagImgInfo.title,

									'children': photoService.tags
								};

								d3.select('#tree').remove();

								force = d3.layout.force()
									.on('tick', tick)
									.size([w, h]);

								vis = d3.select('#tag-tree').append('svg:svg')
									.attr('width', w)
									.attr('height', h)
									.attr('id', 'tree');
								update();

							}

							return {
								loadTagTree: loadTagTree
							};

						};

						var updateTag = function() {
							var tagTree = new TagTree();
							tagTree.loadTagTree();
						};

						photoService.registerTagObserverCallback(updateTag);

					}); //end of d3 function


				} // end of link function
			};
		}
	]);
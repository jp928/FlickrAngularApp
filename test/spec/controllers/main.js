'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('flickrAngularApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should take image from flickr', function () {
    // expect(scope.data.length).toBe(1);
    // expect(scope.photos.length).toBe(1);
    expect(scope.data).toEqual(1);
  });
});

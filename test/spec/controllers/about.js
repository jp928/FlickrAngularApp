'use strict';

describe('Controller: AboutCtrl', function () {

  // load the controller's module
  beforeEach(module('flickrAngularApp'));

  var searchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    searchCtrl = $controller('searchCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    // expect(scope.awesomeThings.length).toBe(3);
  });
});

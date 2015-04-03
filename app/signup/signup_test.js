
describe('myApp.signup', function() {
  beforeEach(function() {
    module('myApp');
    module('myApp.signup');
  });

  describe('SignupCtrl', function() {
    var signupCtrl, $scope;
    beforeEach(function() {
      inject(function($controller) {
        $scope = {};
        signupCtrl = $controller('SignupCtrl', {$scope: $scope});
      });
    });

    it('should define login function', function() {
      expect(typeof $scope.login).toBe('function');
    });

    it('should define createAccount function', function() {
      expect(typeof $scope.createAccount).toBe('function');
    });
  });
});
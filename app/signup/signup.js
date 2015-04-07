"use strict";
angular.module('myApp.signup', ['firebase.utils', 'firebase.auth', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/signup', {
            controller: 'SignupController',
            templateUrl: 'signup/signup.html'
        });
    }])

    .controller('SignupController', ['$scope', 'Auth', '$location', 'fbutil', '$firebaseArray', '$firebaseObject', function ($scope, Auth, $location, fbutil, $firebaseArray, $firebaseObject) {
        $scope.email = null;
        $scope.pass = null;
        $scope.confirm = null;
        $scope.createMode = false;

        $scope.login = function (email, pass) {
            $scope.err = null;
            Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true})
                .then(function (/* user */) {
                    $location.path('/account');
                }, function (err) {
                    $scope.err = errMessage(err);
                });
        };

        $scope.createAccount = function () {
            $scope.err = null;
            if (assertValidAccountProps()) {
                var email = $scope.email;
                var pass = $scope.pass;
                var businessName = $scope.businessName;
                var createDate = Date.now();

                // create user credentials in Firebase auth system
                Auth.$createUser({email: email, password: pass})
                    .then(function () {
                        // authenticate so we have permission to write to Firebase
                        return Auth.$authWithPassword({email: email, password: pass});
                    })
                    .then(function (user) {
                        //TODO: put into module
                        //create a biz record
                        var bizRef = fbutil.ref('businesses');
                        console.log(bizRef);

                        //TODO instantiate array without child read access
                        var bizArray = $firebaseArray(bizRef);
                        console.log(bizArray);


                        bizArray.$add({
                            businessName:businessName,
                            userId: user.uid,
                            lastModDate: createDate,
                            createDate: createDate
                        }).then(function(ref) {

                            var bizId = ref.key();

                            // create a user profile in our data store
                            var usersRef = fbutil.ref('users', user.uid);
                            var currentUser = $firebaseObject(usersRef);
                            currentUser.email = email;
                            currentUser.name = businessName;
                            currentUser.businessId = bizId;
                            currentUser.lastModDate= createDate;
                            currentUser.createDate= createDate;

                            currentUser.$save();

                        });

                    })
                    .then(function (/* user */) {
                        // redirect to the account page
                        $location.path('/account');
                    }, function (err) {
                        $scope.err = errMessage(err);
                    });
            }
        };

        function assertValidAccountProps() {
            if (!$scope.email) {
                $scope.err = 'Please enter an email address';
            }
            else if (!$scope.pass) {
                $scope.err = 'Please enter a password';
            }
            return !$scope.err;
        }

        function errMessage(err) {
            return angular.isObject(err) && err.code ? err.code : err + '';
        }

        function firstPartOfEmail(email) {
            return ucfirst(email.substr(0, email.indexOf('@')) || '');
        }

        function ucfirst(str) {
            // inspired by: http://kevin.vanzonneveld.net
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
        }
    }]);
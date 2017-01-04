'use strict';

/**
 * @ngdoc overview
 * @name jarturaExpressApp
 * @description
 * # jarturaExpressApp
 *
 * Main module of the application.
 */
angular
  .module('jarturaExpressApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

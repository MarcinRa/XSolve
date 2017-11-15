'use strict';

/**
 * @ngdoc overview
 * @name xtestApp
 * @description
 * # xtestApp
 *
 * Main module of the application.
 */
angular
  .module('xtestApp', [])
  .run(["$rootScope",function($rootScope){
    $rootScope.overflow = true;
}]);

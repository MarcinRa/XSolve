'use strict';

/**
 * @ngdoc function
 * @name xtestApp.directive:imgLoadHandler
 * @description
 * # imgLoadHandler
 * Directive of the xtestApp
 */
angular.module('xtestApp')
  .directive('imgLoadHandler', function () {
    return {
      restrict:'A',
      scope:{
        ready: '=ready'
      },
      link: function( $scope, $element){
        $element.on('load',function(e){
          $scope.$apply(function(){
            $scope.ready = true;
          });
        });
      }
    }
  });

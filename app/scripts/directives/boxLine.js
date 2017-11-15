'use strict';

/**
 * @ngdoc function
 * @name xtestApp.directive:boxLine
 * @description
 * # boxLine
 * Controller of the xtestApp
 */
angular.module('xtestApp')
  .directive('boxLine', function ($rootScope) {
    return {
      restrict: "E",
      templateUrl: "views/directive/box_line.html",
      scope: {
        items: "=imgList",
        listId: "@listId",
        pushImg: "&pushImg"
      },
      controller: function($scope){


        let startIndex = 0,
          endIndex = 5,
          isExternalImagesAvailable = true;
        $scope.leftTurnAvailable = false;
        $scope.rightTurnAvailable = true;

        let deleteWatch = $scope.$watch("items", (newVal) =>{
          if(newVal && newVal instanceof Array && newVal.length < 6){
            $scope.rightTurnAvailable = false;
            let existingElements = $scope.items.length;
            for(let i=0; i< 6-existingElements;i++){
              $scope.items.push(emptyElement());
            }
          }
          deleteWatch();
        });

        $scope.moveRight = () => {
          $rootScope.overflow = true;
          [1,2,3].forEach(oneImgRight);
          $scope.$emit("text-find-refresh");
          if(imgNotLoaded()){
            runWatchers();
          } else {
            $rootScope.overflow = false;
          }
        };

        $scope.moveLeft = () => {
          [1,2,3].forEach(oneImgLeft);
          $scope.$emit("text-find-refresh");
        };

        $scope.$on("external-image-list-ends", () => {
          if(endIndex+1>=$scope.items.length) $scope.rightTurnAvailable = false;
          isExternalImagesAvailable = false;
        });

        const emptyElement = () => ({url:"", title:"", active:true, ready:true, highLight:true, empty:true});

        const imgNotLoaded = () => $scope.items.filter(notReady).length != 0;

        const notReady = (item) => !item.ready;

        const runWatchers = () => {
          let deletePreWatcher = $scope.$watch("items",(newVal)=>{
            $scope.imgTrack = newVal.filter(notReady);
            let deleteImgTrackWatcher = $scope.$watch("imgTrack",(newVal)=>{
              if(newVal.filter(notReady).length==0){
                $rootScope.overflow = false;
                deleteImgTrackWatcher();
              }
            },true);
            deletePreWatcher();
          },true);
        };

        const oneImgLeft = () => {
          if(startIndex > 0){
            $scope.items[endIndex].active = false;
            endIndex--;
            startIndex--;
            $scope.items[startIndex].active= true;
            if(startIndex<1) $scope.leftTurnAvailable = false;
          }
          if(endIndex+1<$scope.items.length) $scope.rightTurnAvailable = true;
        };

        const oneImgRight = () => {
            if($scope.items[ endIndex + 1 ]!==undefined || !($scope.items.length <= endIndex + 1)){
              //normal traversing though list
              $scope.items[startIndex].active = false;
              startIndex++;
              endIndex++;
              $scope.items[endIndex].active = true;

            } else if(isExternalImagesAvailable) {
              // try to get image from API
              try{
                $scope.pushImg({index: $scope.listId});
                $scope.items[startIndex].active = false;
                startIndex++;
                endIndex++;
              } catch(e){
                if(e instanceof RangeError) {
                  $scope.rightTurnAvailable = false;
                  isExternalImagesAvailable = false;
                }
              }
            }
          if($scope.items[ endIndex + 1 ]===undefined && !isExternalImagesAvailable){
            $scope.rightTurnAvailable = false;
          }
          if(startIndex>0) $scope.leftTurnAvailable = true;
        }
      }
    }
  });


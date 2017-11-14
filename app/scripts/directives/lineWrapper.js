'use strict';

/**
 * @ngdoc function
 * @name xtestApp.directive:lineWrapper
 * @description
 * # lineWrapper
 * Controller of the xtestApp
 */
angular.module('xtestApp')
  .directive('lineWrapper',['$compile','PhotoService','$rootScope', function ($compile, photoService, $rootScope) {
    return {
      restrict: "E",
      controller: function($scope){
        let mainImagePool;

        $scope.items = [];
        $scope.moreButtonAvailable = true;
        $scope.textElement = "";

        $scope.$watch("textFilter",(newVal,oldVal)=>{
          findElementsWithText(newVal)
        });

        $scope.addNextLine = () => {
          $rootScope.overflow = true;
          let newLineNumber = $scope.items.length;
          try{
            addElementsToList(newLineNumber,6);
          } catch(e){
            $scope.moreButtonAvailable = false;
          }
          runWatchers();
          findElementsWithText($scope.textFilter);
          $scope.createNewLine(newLineNumber);

        };

        $scope.pushImg = function(index){
          addElementsToList(index,1);
        };

        $scope.$on("external-image-list-ends", () => {
          $scope.moreButtonAvailable = false;
        });

        $scope.$on("text-find-refresh",() => {
          findElementsWithText($scope.textFilter);
        });

        const lineStarter = () => {
          addElementsToList($scope.items.length,6);
        };

        const findElements = (items) => {
          return items
            .reduce(makeItFlat,[])
            .filter(notLoadedImg);
        };

        const findElementsWithText = (text) => {
          let trackObjects = $scope.items
            .reduce(makeItFlat,[])
            .filter(onlyActiveElements);

          if(!text || text === "" ){
            $scope.foundElements = 0;
            trackObjects.map(highLightElement);
          } else {
            highLightReset(trackObjects);
            $scope.foundElements = trackObjects
              .filter((item) => item.title.search(text)!=-1)
              .map(highLightElement)
              .length;
          }
        };

        const highLightReset = (items) => {
          items.map((item)=> {
            item.highLight = false;
            return item;
          })
        };

        const highLightElement = (item) => {
          item.highLight = true;
          return item;
        };
        const notLoadedImg = (item) => !item.ready;
        const makeItFlat = (sum, item) => sum.concat(item);
        const onlyActiveElements = (item) => item.active;

        const addElementsToList = (index,count) => {
          if($scope.items[index]===undefined){
            $scope.items[index]=[];
          }
          for(let i = 0; i < count; i++){
            if(mainImagePool.length > 0){
              let temp = mainImagePool.shift();

              temp.active = true;
              $scope.items[index].push(temp);
            } else {
              $scope.$broadcast("external-image-list-ends");
              throw new RangeError("No more items in external list");
              break;
            }
          }
        };

        const runWatchers= () => {
          let deleteItemsWatcher = $scope.$watch("items",(newVal,oldVal)=>{
            $scope.trackImg = findElements(newVal);
            let deleteWatcherWhenAllImgReady = $scope.$watch("trackImg",(newVal,oldVal)=>{
              if(newVal.filter(notLoadedImg).length == 0){
                deleteWatcherWhenAllImgReady();
                $rootScope.overflow = false;
              }
            },true);

            deleteItemsWatcher();
          },true);
        };

        const init = () => {
          photoService.getMedia().then((items) => {
            mainImagePool = items.map((item) => ({url:item.url, title:item.title, active:false, ready:false, highLight:true, empty:false}));
            $rootScope.overflow = true;
            lineStarter();
            lineStarter();
            runWatchers();
            findElementsWithText("");

          });
        };
        init();
      },

      link: function($scope, $element, $attr){

        $scope.createNewLine = (id) => {
            let new_list = $compile('<box-line class="header-wrapper" img-list="items['+id+']" list-id="'+id+'" push-img="pushImg(index)"></box-line>')($scope);
            $element.find("#line-table").append(new_list);
        };

        function init(){
          $scope.createNewLine(0);
          $scope.createNewLine(1);
        };
        init();
      }
    }
  }]);


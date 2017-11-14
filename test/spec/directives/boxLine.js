'use strict';

describe('Directive: box-line', function () {

  var $scope, scope, compile, directiveElement;

  beforeEach(module('xtestApp'));

  beforeEach(inject(function($rootScope, $compile, $templateCache) {
    $scope = $rootScope.$new();
    compile = $compile;
    $scope.list = prepareListOfElements(6);
    $scope.pushImg = function(index){
      throw new RangeError();
    };

    $templateCache.put('views/directive/box_line.html','' +
      '<div class="arrow">' +
      '  <div ng-show="leftTurnAvailable" class="left-arrow" ng-click="moveLeft()"></div>\n' +
      '</div>' +
      '<div class="line">' +
      '    <div ng-if="item.active" ng-class="{\'box\':true, \'no-border\':item.empty, \'highlight\':item.highLight}" ng-repeat="item in items">' +
      '        <img ng-if="!item.empty" ng-src="{{item.url}}" alt="{{item.title}}" ready="item.ready" img-load-handler>' +
      '        <div ng-if="!item.empty">' +
      '          <p>{{::item.title}}</p>' +
      '        </div>' +
      '    </div>' +
      '</div>' +
      '<div class="arrow">' +
      '  <div ng-show="rightTurnAvailable" class="right-arrow" ng-click="moveRight()"></div>' +
      '</div>');

    directiveElement = getCompiledElement();
    $scope.$digest();

  }));

  it('when directive is created - arrow left should be hidden, right available', function () {
    //given
    scope = directiveElement.isolateScope();

    //then
    var el = directiveElement.find("div.arrow>div");
    expect(el.eq(0).hasClass('ng-hide')).toBeTruthy();
    expect(el.eq(1).hasClass('ng-hide')).toBeFalsy();
  });

  it('should always have 6 elements( list gaven 3), and arrows hidden ', function(){
    //given
    $scope.list = prepareListOfElements(3);
    directiveElement = getCompiledElement();
    var el = directiveElement.find("div.arrow>div");
    scope = directiveElement.isolateScope();

    //then
    expect(scope.items.length).toEqual(6);
    expect(el.eq(0).hasClass('ng-hide')).toBeTruthy();
    expect(el.eq(1).hasClass('ng-hide')).toBeTruthy();
  });

  it('should move all line right 3 elements, left arrow should be visible', function () {
    //given
    $scope.list = $scope.list.concat(prepareListOfElements(6,false));
    directiveElement = getCompiledElement();
    var el = directiveElement.find("div.arrow>div");
    var boxList = directiveElement.find(".line > .box");
    scope = directiveElement.isolateScope();
    $scope.$digest();

    //when
    scope.moveRight();
    scope.$digest();

    //then
    expect(scope.items[0].active).toBeFalsy();
    expect(scope.items[1].active).toBeFalsy();
    expect(scope.items[2].active).toBeFalsy();
    expect(scope.items.filter((i)=>i.active==true).length).toBe(6);
    expect(scope.items[9].active).toBeFalsy();
    expect(scope.items[10].active).toBeFalsy();
    expect(scope.items[11].active).toBeFalsy();

    expect(el.eq(0).hasClass('ng-hide')).toBeFalsy();
    expect(el.eq(1).hasClass('ng-hide')).toBeFalsy();

    expect(boxList.length).toEqual(6);
  });

  it('should call external function to get img from api', function () {
    //given
    $scope.list = $scope.list.concat(prepareListOfElements(1,false));

    scope = directiveElement.isolateScope();
    $scope.$digest();

    //when
    scope.moveRight();
    $scope.$digest();

    //then
    expect(typeof(scope.pushImg)).toEqual('function');
    expect(scope.pushImg).toThrowError();
    expect(scope.items[0].active).toBe(false);
    expect(scope.items[1].active).toBe(true);
    expect(scope.items[2].active).toBe(true);
    expect(scope.items[6].active).toBe(true);
  });

  it('should move line left', function(){
    //give
    $scope.list = prepareListOfElements(6,true);
    $scope.list = $scope.list.concat(prepareListOfElements(6,false));
    var el = directiveElement.find("div.arrow>div");
    scope = directiveElement.isolateScope();
    $scope.$digest();
    scope.moveRight();
    scope.moveRight();

    //then
    scope.moveLeft();
    scope.$digest();

    //then
    expect(scope.items.length).toEqual(12);
    expect(scope.items[0].active).toBeFalsy();
    expect(scope.items[1].active).toBeFalsy();
    expect(scope.items[2].active).toBeFalsy();
    expect(scope.items.filter((i)=>i.active==true).length).toBe(6);
    expect(scope.items[9].active).toBeFalsy();
    expect(scope.items[10].active).toBeFalsy();
    expect(scope.items[11].active).toBeFalsy();

    expect(el.eq(0).hasClass('ng-hide')).toBeFalsy();
    expect(el.eq(1).hasClass('ng-hide')).toBeFalsy();
  });

  function getCompiledElement(){
    var element = angular.element('<box-line class="header-wrapper" ' +
      'img-list="list" list-id="0"' +
      'push-img="pushImg(index)"></box-line>');

    var template = compile(element)($scope);
    $scope.$digest();
    return template;
  }

  function prepareListOfElements(len,_active=true,_ready=true,_empty=false){
    return Array.from(Array(len).keys())
      .map((item) => ({active:_active,
        empty:_empty,
        highLight:true,
        ready:_ready,
        title:"test",
        url:""}));
  }
});

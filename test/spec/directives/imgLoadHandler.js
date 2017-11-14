'use strict';

describe('Directive: box-line', function () {

  var $scope, compile, directiveElement;

  beforeEach(module('xtestApp'));
  beforeEach(inject(function($rootScope, $compile){
    $scope = $rootScope.$new();
    compile = $compile;
    $scope.item = getItem();

    var element = angular.element('<div><img ng-if="!item.empty" ' +
      'ng-src="{{item.url}}" alt="{{item.title}}" ' +
      'ready="item.ready" img-load-handler></div>');
    directiveElement = compile(element)($scope);
    $scope.$digest();
  }));

  it("should change flag 'ready' when image is loaded", function(){
    //given
    var isolatedScope = directiveElement.find('img').isolateScope();
    //when
    directiveElement.find('img').trigger('load');
    $scope.$digest();

    //then
    expect(isolatedScope.ready).toBeTruthy();
    expect($scope.item.ready).toBeTruthy();
  });

  var getItem = (_active=true,_empty=false,_ready=false) =>({active:_active,
           empty:_empty,
           highLight:true,
           ready:_ready,
           title:"test",
           url:"abc.jpg"})
});

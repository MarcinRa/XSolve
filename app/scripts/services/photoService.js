'use strict';

/**
 * @ngdoc function
 * @name xtestApp.services:PhotoService
 * @description
 * # PhotoService
 * Service of the xtestApp
 */
angular.module('xtestApp')
  .service('PhotoService', function ($http) {
    this.getMedia = () => $http({
      url: "https://jsonplaceholder.typicode.com/photos",
      method: "GET",
      params: {albumId: 1}
    }).then((data) => data.data)
      .catch((e) => console.error("Api is not available", e));
    });

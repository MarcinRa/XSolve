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
    this.getMedia = () => $http.get("https://jsonplaceholder.typicode.com/photos",{params: {albumId: 1}})
      .then((data) => data.data,
            (error)=>{
              window.location.replace("/404.html");
      });
    });

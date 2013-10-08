'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version','Constants', function(version,Constants) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version+"_"+Constants.ENV);
    }
  }]);

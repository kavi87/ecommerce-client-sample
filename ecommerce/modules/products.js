define([
    'require',
    'jquery',
    '{angular}/angular',

    '{ecommerce}/modules/services'

], function (require, $, angular) {
    'use strict';

    var module = angular.module('products', []);

    module.controller('ProductsController', ['$scope', 'DataService', '$location', 'HomeService', 'ErrorService', function ($scope, dataService, $location, hypermedia, error) {

        var setup = function (resource) {
            $scope.resource = resource;

            $scope.products = resource.$embedded ? resource.$embedded('products') : [];

            if (!($scope.products instanceof Array)) {
                $scope.products = [$scope.products];
            }

            $scope.next = resource.$links('next');
            $scope.previous = resource.$links('prev');

            angular.forEach($scope.products, function (product) {
                if (product.$links) {

                    product.$links('tags').get(function (tags) {
                        product.tags = tags.$embedded('tags');
                    });

                }

            });

        };

        $scope.nextPage = function () {
            $scope.next.get(setup, error);
        };

        $scope.previousPage = function () {
            $scope.previous.get(setup, error);
        };

        $scope.search = function (query) {
            if (query) {
                $scope.resource.$get({ q: query }, setup, error);
            } else {
                hypermedia('ecommerce').enter('catalog', { page: 1 }).get(setup, error);
            }
        };

        $scope.select = function (product, index) {
            product.$links('self').get(function (selectedProduct) {
                dataService.selectedProduct(selectedProduct);
                $location.path('/ecommerce/product/' + selectedProduct.name);
            });

        };

        hypermedia('ecommerce').enter('catalog', { page: 1 }).get(setup, error);

    }]);

    return {
        angularModules: [ 'products' ]
    };
});

var localHostUrl = window.location.origin || window.location.protocol + '//' + window.location.host;

var applicationModule = angular.module("applicationModule", ['ui.router','ngResource', 'ngRoute', 'ngAnimate']);

applicationModule.config(function ($urlRouterProvider, $stateProvider, $locationProvider, GlobalInfo) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/app/components/home/homeView.html',
                controller: 'homeController'
            });

            // use the HTML5 History API
            $locationProvider.html5Mode(true);
    })
    .constant('GlobalInfo',
    {
        apiUrl: '/api',
        localHostUrl: localHostUrl
    });

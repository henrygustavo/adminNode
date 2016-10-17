angular.module("applicationAdminModule").factory('accountRepository', function($http, $q, GlobalInfo) {
    return {
        create: function (model) {
            var deferred = $q.defer();

            $http.post(GlobalInfo.apiUrl + '/account/register', model)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        },
        login: function (model) {
            var deferred = $q.defer();

            $http.post(GlobalInfo.apiUrl + '/account/authenticate', model)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        },
        changePassowrd: function (model) {

            var deferred = $q.defer();

            $http.post(GlobalInfo.apiUrl + '/account/changePassword', model)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        },
        forgotPassword: function (model) {

            var deferred = $q.defer();

            $http.post(GlobalInfo.apiUrl + '/account/forgotPassword', model)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        },
        resetPassword: function (model) {

            var deferred = $q.defer();
            $http.post(GlobalInfo.apiUrl + '/account/resetPassword', model)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        },
        verificationToken: function (token) {

            var deferred = $q.defer();
            $http.get(GlobalInfo.apiUrl + '/account/verificationToken/'+ token)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        }
    };
});

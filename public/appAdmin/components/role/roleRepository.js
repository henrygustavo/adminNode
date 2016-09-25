angular.module("applicationAdminModule").factory('roleRepository', function ($http, $q, GlobalInfo) {
    return {
        getAll: function (params) {
            var deferred = $q.defer();
            $http.get(GlobalInfo.apiUrl + '/Role/GetAll', { params: params })
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        },
        getAllList: function () {
            var deferred = $q.defer();
            $http.get(GlobalInfo.apiUrl + '/Role/GetAllRoles')
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        },
        save: function (model) {
            var deferred = $q.defer();

            $http.post(GlobalInfo.apiUrl + '/Role/Save', model)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        },
        getModel: function (id) {
            var deferred = $q.defer();

            $http.get(GlobalInfo.apiUrl + '/Role/GetModel?id=' + id)
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
angular.module("applicationAdminModule").controller("userDetailController", function (id, $scope, $state,$filter, helperService, roleRepository, userRepository) {

    $scope.model = {};
    $scope.model._id = id;

	helperService.activateView('user');


    var getModel = function (idModel) {

        userRepository.getModel(idModel).then(
            function (response) {
                $scope.model.name = response.name;
                $scope.model.email = response.email;
                $scope.model.role = response.role;
                $scope.model.lockoutEnabled = response.lockoutEnabled;
                $scope.model.disabled = response.disabled;
            },
            function (response) {
                helperService.handlerError(response);
            }
        );
    };

    var initialLoad = function () {

        getModel(id);
    };

    initialLoad();
});

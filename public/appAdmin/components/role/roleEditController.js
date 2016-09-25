angular.module("applicationAdminModule").controller("roleEditController", function (id, $scope, $state, helperService, roleRepository) {

    $scope.model = {};
    $scope.model.id = id;

	helperService.activateView('role');

    $scope.save = function (model) {

        roleRepository.save(model).then(
            function (response) {
                helperService.showAlert(response, "success");
                $state.go('roleList');
            },
            function (response) {
                helperService.handlerError(response);
            }
        );
    };

    var getModel = function (idModel) {

        roleRepository.getModel(idModel).then(
            function (response) {
                $scope.model.name = response.name;
            },
            function (response) {
                helperService.handlerError(response);
            }
        );
    };

    var initialLoad = function () {

        if (id != 0)
         getModel(id);
    };

    initialLoad();
});
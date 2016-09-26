angular.module("applicationAdminModule").controller("roleEditController", function(id, $scope, $state, helperService, roleRepository) {

    $scope.model = {};
    $scope.model._id = id;

    helperService.activateView('role');

    $scope.save = function(model) {

        if (model._id != 0) {
            update(model);
        } else {
            insert(model);
        }
    };

    var insert = function(model) {

        roleRepository.insert(model).then(
            function(response) {
                helperService.showAlert(response, "success");
                $state.go('roleList');
            },
            function(response) {
                helperService.handlerError(response);
            }
        );
    };

    var update = function(model) {

        roleRepository.update(model).then(
            function(response) {
                helperService.showAlert(response, "success");
                $state.go('roleList');
            },
            function(response) {
                helperService.handlerError(response);
            }
        );
    };

    var getModel = function(idModel) {

        roleRepository.getModel(idModel).then(
            function(response) {
                $scope.model.name = response.name;
            },
            function(response) {
                helperService.handlerError(response);
            }
        );
    };

    var initialLoad = function(idModel) {

        if (idModel != 0)
            getModel(idModel);
    };

    initialLoad(id);
});

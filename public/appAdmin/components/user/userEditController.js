angular.module("applicationAdminModule").controller("userEditController", function (id, $scope, $state, helperService, roleRepository, userRepository, GlobalInfo) {

    $scope.model = {};
    $scope.model._id = id;
    $scope.model.confirmUrl = GlobalInfo.confirmUrl;

	helperService.activateView('user');

    $scope.save = function (model) {

        if (model._id != 0) {
            update(model);
        } else {
            insert(model);
        }
    };

    var insert = function(model) {

        userRepository.insert(model).then(
            function(response) {
                helperService.showAlertResponse(response);
                $state.go('userList');
            },
            function(response) {
                helperService.handlerError(response);
            }
        );
    };

    var update = function(model) {

        userRepository.update(model).then(
            function(response) {
                helperService.showAlertResponse(response);
                $state.go('userList');
            },
            function(response) {
                helperService.handlerError(response);
            }
        );
    };

    var getRoles = function (role) {

        roleRepository.getAllList().then(
           function (response) {
               $scope.model.roles = response;
               $scope.model.role = role;
           },
           function (response) {

               helperService.handlerError(response);
           }
       );
    };

    var getModel = function(idModel) {

        userRepository.getModel(idModel).then(
            function (response) {
                $scope.model.name = response.name;
                $scope.model.email = response.email;
                getRoles(response.role);
                $scope.model.lockoutEnabled = (response.lockoutEnabled == "1");
                $scope.model.disabled = (response.disabled  == "1");
            },
            function (response) {
                helperService.handlerError(response);
            }
        );
    };

    var initialLoad = function(idModel) {

        if (idModel != 0) {

            getModel(idModel);
        } else {

            getRoles("");
        }
    };

    initialLoad(id);

});

angular.module("applicationAdminModule").controller("userEditController", function (id, $scope, $state, helperService, roleRepository, userRepository, GlobalInfo) {

    $scope.model = {};
    $scope.model._id = id;

	helperService.activateView('user');

    $scope.save = function (model) {

        model.confirmUrl = GlobalInfo.confirmUrl;
        
        if (model._id != undefined) {
            update(model);
        } else {
            insert(model);
        }
    };

    var insert = function(model) {

        userRepository.insert(model).then(
            function(response) {
                helperService.showAlert(response, "success");
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
                helperService.showAlert(response, "success");
                $state.go('userList');
            },
            function(response) {
                helperService.handlerError(response);
            }
        );
    };

    var getRoles = function (role) {

        roleRepository.getAll().then(
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
                $scope.model.lockoutEnabled = response.lockoutEnabled;
                $scope.model.disabled = response.disabled;
            },
            function (response) {
                helperService.handlerError(response);
            }
        );
    };

    var initialLoad = function(idModel) {

        if (idModel != undefined) {

            getModel(idModel);
        } else {

            getRoles("");
        }
    };

    initialLoad(id);

});
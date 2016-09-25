angular.module("applicationAdminModule").controller("userEditController", function (id, $scope, $state, helperService, roleRepository, userRepository, GlobalInfo) {

    $scope.model = {};
    $scope.model.id = id;
    
	helperService.activateView('user');

    $scope.save = function (model) {
   
        model.confirmUrl = GlobalInfo.confirmUrl;
        userRepository.save(model).then(
            function (response) {
                helperService.showAlert(response, "success");
                $state.go('userList');
            },
            function (response) {
                helperService.handlerError(response);
            }
        );   
    };

    var getRoles = function (value) {

        roleRepository.getAllList().then(
           function (response) {
               $scope.model.roles = response;
               $scope.model.roleId = value;
           },
           function (response) {

               helperService.handlerError(response);
           }
       );
    };

    var getModel = function(idModel) {

        userRepository.getModel(idModel).then(
            function (response) {
                $scope.model.userName = response.userName;
                $scope.model.email = response.email;
                getRoles(response.roleId.toString());
                $scope.model.lockoutEnabled = response.lockoutEnabled;
                $scope.model.disabled = response.disabled;
            },
            function (response) {
                helperService.handlerError(response);
            }
        );     
    };

    var initialLoad = function() {

        if (id != 0) {

            getModel(id);
        } else {
          
            getRoles("0");
        }
    };

    initialLoad();

});
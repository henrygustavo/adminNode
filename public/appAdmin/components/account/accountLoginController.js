angular.module("applicationAdminModule").controller("accountLoginController", function ($scope, $rootScope, $state, $auth, helperService, accountRepository, GlobalInfo, $location) {

	$scope.isRedirected = ($rootScope.returnToState != undefined && $rootScope.returnToState != '' && $rootScope.returnToState != '/');

    $scope.login = function (model) {

        accountRepository.login(model).then(
            function (response) {
                var data = "userName=" + response.userName + "&password=" + model.password + "&grant_type=password" + "&client_id:" + response.id;
                $auth.login(data).then(function (res) {

					handlerRedirect();

					helperService.activateMenu();

                     var message = 'Hola ' + response.userName + ' !';

                    if (!response.emailConfirmed) {
                        message += 'Solo como recordatorio,por favor activa tu cuenta pronto :)';
                    }

                    helperService.showAlert(message, 'success');

                    helperService.activateMenu();

                }).catch(helperService.handlerError);
            },
            function (response) {
                helperService.handlerError(response);
            }
        );
    };

    var verifyIsisAuthenticated = function () {

        if ($auth.isAuthenticated()) {
            $state.go('home');
            helperService.activateMenu();
        }
    };

    var handlerEmailConfirmation = function () {

        var searchObject = $location.search();

        if (searchObject.emailconfirmation != undefined) {

            if (searchObject.emailconfirmation == 'success') {

               helperService.showAlert("Gracias por su confirmación", 'success');
            } else {
                helperService.showAlert(searchObject.emailconfirmation, 'error');
            }
        }
    };

	var handlerRedirect = function () {

        if ($scope.isRedirected) {

            var id = ($rootScope.returnToStateParams != undefined) ? $rootScope.returnToStateParams : "";

            $location.path($rootScope.returnToState.replace(":id", "") + id);
            $rootScope.returnToState = "";
        }
        else {
            $state.go('home');
        }

    };

    handlerEmailConfirmation();

    verifyIsisAuthenticated();
});
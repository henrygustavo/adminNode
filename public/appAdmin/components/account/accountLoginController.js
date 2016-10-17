angular.module("applicationAdminModule").controller("accountLoginController", function($scope, $rootScope, $state, $auth, helperService, accountRepository, GlobalInfo, $location) {

    $scope.isRedirected = ($rootScope.returnToState != undefined && $rootScope.returnToState != '' && $rootScope.returnToState != '/');

    $scope.login = function(model) {

        $auth.login(model).then(function(res) {

            handlerRedirect();

            helperService.activateMenu();

            var message = 'Hola ' + res.data.name + ' !';

            if (!res.data.emailConfirmed) {
                message += 'Solo como recordatorio,por favor activa tu cuenta pronto :)';
            }

            helperService.showAlert(message, 'success');

            helperService.activateMenu();

        }).catch(helperService.handlerError);
    };

    var verifyIsisAuthenticated = function() {

        if ($auth.isAuthenticated()) {
            $state.go('home');
            helperService.activateMenu();
        }
    };

    var handlerRedirect = function() {

        if ($scope.isRedirected) {

            var id = ($rootScope.returnToStateParams != undefined) ? $rootScope.returnToStateParams : "";

            $location.path($rootScope.returnToState.replace(":id", "") + id);
            $rootScope.returnToState = "";
        } else {
            $state.go('home');
        }

    };

    verifyIsisAuthenticated();
});

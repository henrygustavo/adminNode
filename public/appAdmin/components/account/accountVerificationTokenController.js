angular.module("applicationAdminModule").controller("accountVerificationTokenController", function(token, $scope, $state, $auth, helperService, accountRepository, GlobalInfo, $location) {

    $scope.mensaje = "";
    $scope.response = "";

    var handlerEmailConfirmation = function(token) {

        accountRepository.verificationToken(token).then(

            function(response) {

                $scope.response = response;
                $scope.mensaje = (response.success) ? "Gracias por su confirmación, por favor inicie sesión" : "Hubo un error vuelva intertalo luego";

            },
            function(response) {
                helperService.handlerError(response);
                $scope.mensaje =  "Hubo un error vuelva intertalo luego";
            }
        );
    };

    handlerEmailConfirmation(token);

});

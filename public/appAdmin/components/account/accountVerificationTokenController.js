angular.module("applicationAdminModule").controller("accountVerificationTokenController", function(token, $scope, $state, $auth, helperService, accountRepository, GlobalInfo, $location) {

    $scope.mensaje = "";
    $scope.response = "";

    var handlerEmailConfirmation = function(token) {

        accountRepository.verificationToken(token).then(

            function(response) {

                $scope.response = response;
            },
            function(response) {
                helperService.handlerError(response);
            }
        );
    };

    handlerEmailConfirmation(token);

});

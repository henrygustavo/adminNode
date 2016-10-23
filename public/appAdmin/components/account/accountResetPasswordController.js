angular.module("applicationAdminModule").controller('accountResetPasswordController', function(token, $scope, $location, $state, accountRepository, helperService) {
  $scope.model  = {};
    $scope.model.token = token;

    $scope.resetPassword = function(model) {

        accountRepository.resetPassword(model).then(
            function(response) {
                helperService.showAlertResponse(response);
                $state.go('login');
            },
            function(response) {
                helperService.handlerError(response);
            }
        );
    };
});

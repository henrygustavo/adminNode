angular.module("applicationAdminModule").controller('accountResetPasswordController', function ($scope, $location, $state, accountRepository, helperService) {

    $scope.resetPassword = function (model) {

        var searchObject = $location.search();

        if (searchObject.code != undefined) {

            $scope.model.code = searchObject.code;

            accountRepository.resetPassword(model).then(
                function(response) {
                    helperService.showAlert(response, 'success');
                    $state.go('login');
                },
                function(response) {
                    helperService.handlerError(response);
                }
            );          
        }
    };
});

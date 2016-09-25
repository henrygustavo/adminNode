var localHostUrl = window.location.origin || window.location.protocol + '//' + window.location.host;

var applicationModule = angular.module("applicationAdminModule", ['ui.router', 'ngMessages', 'satellizer','permission', 'permission.ui', 'blockUI', 'ui.bootstrap', 'ui.mask', 'fcsa-number', 'ngGrid']);

applicationModule.config(function ($urlRouterProvider, $stateProvider, $locationProvider, $authProvider, GlobalInfo, blockUIConfig) {

	$urlRouterProvider.otherwise('/');

	$stateProvider
	.state('home', {
			url: '/',
			templateUrl: '/appAdmin/components/home/homeView.html',
			controller: 'homeController',
			authenticate: true,
			data: {	permissions: {only: ['AUTHORIZED'],redirectTo: 'login'	}
		}
	})
	 .state('login', {
			url: '/login',
			templateUrl: '/appAdmin/components/account/accountLoginView.html',
			controller: 'accountLoginController',
			data: {	permissions: {only: ['ANONYMOUS'] } }
	 })
     .state('changepw', {
        	url: '/changepassword',
        	templateUrl: '/appAdmin/components/account/accountChangePasswordView.html',
        	controller: 'accountChangePasswordController',
			authenticate: true,
			data: {	permissions: {only: ['AUTHORIZED'],redirectTo: 'login'}	}
        	  })
	 .state('accessDenied', {
			url: '/accessDenied',
			templateUrl: '/appAdmin/components/accessDenied/accessDeniedView.html',
			controller: 'accessDeniedController',
			authenticate: true,
			data: {	permissions: {only: ['AUTHORIZED'],redirectTo: 'login'	}
		  }
	  })
	 .state('forgotpw', {
			url: '/forgotpassword',
			templateUrl: '/appAdmin/components/account/accountForgotPasswordView.html',
			controller: 'accountForgotPasswordController',
			data: {	permissions: {only: ['ANONYMOUS']	}
		  }
	  })
	.state('resetpw', {
			url: '/resetpassword',
			templateUrl: '/appAdmin/components/account/accountResetPasswordView.html',
			controller: 'accountResetPasswordController',
			data: {	permissions: {only: ['ANONYMOUS']	}
		}
	})
	 .state('userList', {
			url: '/user',
			templateUrl: '/appAdmin/components/user/userListView.html',
			controller: 'userListController',
			authenticate: true,
			data: {	permissions: {only: ['ADMIN'],redirectTo: 'accessDenied'}	}
	 })
	 .state('userEdit', {
			url: '/user/edit/:id',
			templateUrl: '/appAdmin/components/user/userEditView.html',
			controller: 'userEditController',
			authenticate: true,
			resolve: {
						id: function ($stateParams) {
							return $stateParams.id;
							}
					},
			data: {	permissions: {only: ['ADMIN'],redirectTo: 'accessDenied'	}
		 }
	 })
	.state('userDetail', {
			url: '/user/detail/:id',
			templateUrl: '/appAdmin/components/user/userDetailView.html',
			controller: 'userDetailController',
			authenticate: true,
			resolve: {
						id: function ($stateParams) {
							return $stateParams.id;}
					},
			data: {	permissions: {only: ['ADMIN'],redirectTo: 'accessDenied'}	}
	})
	 .state('roleList', {
			url: '/role',
			templateUrl: '/appAdmin/components/role/roleListView.html',
			controller: 'roleListController',
			authenticate: true,
			data: {	permissions: {only: ['ADMIN'],redirectTo: 'accessDenied'	}
		 }
	 })
	 .state('roleEdit', {
			url: '/role/edit/:id',
			templateUrl: '/appAdmin/components/role/roleEditView.html',
			controller: 'roleEditController',
			authenticate: true,
			resolve: {
						id: function ($stateParams) {
							return $stateParams.id;}
					},
			data: {	permissions: {only: ['ADMIN'],redirectTo: 'accessDenied'	}
		 }
	 })
	 .state('roleDetail', {
			url: '/role/detail/:id',
			templateUrl: '/appAdmin/components/role/roleDetailView.html',
			controller: 'roleDetailController',
			authenticate: true,
			resolve: {
						id: function ($stateParams) {
							return $stateParams.id;
						}
					},
			data: {	permissions: {only: ['ADMIN'],redirectTo: 'accessDenied'	}
		 }
	 })
	;

	var urlRegisterLogin = GlobalInfo.apiUrl + '/Account/RegisterLoginExternal';

	$authProvider.loginUrl = GlobalInfo.apiUrl + '/oauth/token';
	$authProvider.tokenName = 'access_token';

	blockUIConfig.message = 'Por favor espere!';

	// use the HTML5 History API
	$locationProvider.html5Mode(true);

})
.constant('GlobalInfo',
{
	apiUrl: '/api',
	localHostUrl: localHostUrl+'/admin/',
	resetUrl: localHostUrl + '/admin/resetpassword',
	confirmUrl: localHostUrl + '/admin/login?emailconfirmation'
})
.run(function (PermRoleStore, authManager, $rootScope, $state) {

	// Define anonymous role
    PermRoleStore.defineRole('ADMIN', function (stateParams) {
		return authManager.isInRole("admin");
	});

    PermRoleStore.defineRole('ANONYMOUS', function (stateParams) {
		return authManager.isAnonymous();
	});

    PermRoleStore.defineRole('AUTHORIZED', function (stateParams) {
		return !authManager.isAnonymous();
	});

	 // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if (toState.authenticate && authManager.isAnonymous()) {
                $rootScope.returnToState = toState.url;
                $rootScope.returnToStateParams = toParams.id;
                $state.go('login', {});
            }
    });
})
;

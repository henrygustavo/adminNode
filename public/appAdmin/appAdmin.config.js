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
			data: {	permissions: {only: ['AUTHORIZED'],redirectTo: 'login'	}}
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
			data: {	permissions: {only: ['AUTHORIZED'],redirectTo: 'login'	}}
	  })
	 .state('forgotpw', {
			url: '/forgotpassword',
			templateUrl: '/appAdmin/components/account/accountForgotPasswordView.html',
			controller: 'accountForgotPasswordController',
			data: {	permissions: {only: ['ANONYMOUS']	}}
	  })
	.state('resetpw', {
			url: '/resetpassword/:token',
			templateUrl: '/appAdmin/components/account/accountResetPasswordView.html',
			controller: 'accountResetPasswordController',
			data: {	permissions: {only: ['ANONYMOUS']	}},
			resolve: {
 					 token: function ($stateParams) {
 						 return $stateParams.token;
 						 }
 				 }
	})
	.state('verificationToken', {
		 url: '/verificationToken/:token',
		 templateUrl: '/appAdmin/components/account/accountVerificationTokenView.html',
		 controller: 'accountVerificationTokenController',
		 data: {	permissions: {only: ['ANONYMOUS']	}},
		 resolve: {
					 token: function ($stateParams) {
						 return $stateParams.token;
						 }
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
			data: {	permissions: {only: ['ADMIN'],redirectTo: 'accessDenied'	}}
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
			data: {	permissions: {only: ['ADMIN'],redirectTo: 'accessDenied'	} }
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
			data: {	permissions: {only: ['ADMIN'],redirectTo: 'accessDenied'	}}
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
			data: {	permissions: {only: ['ADMIN'],redirectTo: 'accessDenied'	}}
	 })
	;

	$authProvider.loginUrl = GlobalInfo.apiUrl + '/account/authenticate';
	$authProvider.authHeader = 'x-access-token';
	$authProvider.authToken ='';

	blockUIConfig.message = 'Por favor espere!';

	// use the HTML5 History API
	//$locationProvider.html5Mode(true);

})
.constant('GlobalInfo',
{
	apiUrl: '/api',
	localHostUrl: localHostUrl+'/admin#/',
	resetUrl: localHostUrl + '/admin#/resetpassword',
	confirmUrl: localHostUrl + '/admin#/verificationToken'
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
})
;

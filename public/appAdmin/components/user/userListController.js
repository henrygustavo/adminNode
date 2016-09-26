angular.module("applicationAdminModule").controller("userListController", function ($scope, userService,helperService) {

    userService.iniData();
    userService.find();
    $scope.data = userService.data;

	helperService.activateView('user');

    $scope.search = function(model) {

        var name = (model != undefined) ? model.searchUserName : '';
        var email = (model != undefined) ? model.searchEmail : '';
        var filterObj = (model != undefined) ? [{ "Field": "name", "Value": name, "Sign": "%" }, { "Field": "email", "Value": email, "Sign": "%" }] : '';

        userService.data.filterOptions.filterText = filterObj;
        $scope.data.pagingOptions.currentPage = 1;
        userService.find();

    };
    $scope.$watch('data.sortOptions.fields', function (newVal, oldVal) {

        if (newVal.length > 0 && newVal !== oldVal) {
            $scope.data.pagingOptions.currentPage = 1;
            userService.find();
        }
    }, true);

    $scope.$watch('data.sortOptions.directions', function (newVal, oldVal) {

        if (newVal.length > 0 && newVal !== oldVal) {
            $scope.data.pagingOptions.currentPage = 1;
            userService.find();
        }
    }, true);

    $scope.$watch('data.pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {

		if (newVal.pageSize != oldVal.pageSize) {
                $scope.data.pagingOptions.currentPage = 1;
            }
            userService.find();
        }
    }, true);

    var rowTemplate = '<div class="ngCellText" style="text-align:center"><a href="#/user/edit/{{row.entity.id}}" class="btn btn-xs btn-info" style="font-size:15px;margin-right:10px"><i class="glyphicon glyphicon-pencil"></i></a><a href="#/user/detail/{{row.entity.id}}" class="btn btn-xs btn-warning" style="font-size:15px"><i class="glyphicon glyphicon-eye-open"></i></a></div>';
    $scope.ngGridView = {
        data: 'data.entities.content',
        showFilter: false,
        multiSelect: false,
        enablePaging: true,
        showFooter: true,
        i18n: 'es',
        totalServerItems: 'data.entities.totalRecords',
        pagingOptions: $scope.data.pagingOptions,
        filterOptions: $scope.data.filterOptions,
        useExternalSorting: true,
        enableHighlighting: true,
        sortInfo: $scope.data.sortOptions,
        rowHeight: 50,
        columnDefs: [
                    { field: '', displayName: '', width: '70', sortable: false, cellTemplate: '<div class="ngCellText">{{row.rowIndex + 1}}</div>' },
                    { field: 'name', displayName: 'Nombre de Usurio', width: '200' },
                    { field: 'roleName', displayName: 'Rol', width: '100' },
                    { field: 'email', displayName: 'Email', width: '250' },
                    { field: 'disabled', displayName: 'Deshabilitado', width: '100' },
                    { field: 'lastActivityDate', displayName: 'Ultima actualizacion', cellFilter: 'date:\'dd/MM/yyyy HH:MM:ss\'', width: '200'},
                    { field: 'edit', displayName: '', width: '120', sortable: false, cellTemplate: rowTemplate }
        ]
    };
});

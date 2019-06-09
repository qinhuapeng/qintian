angular.module('myApp').controller('RoleCtrl', function($scope, RoleService, $location, $routeParams , $uibModal) {
    $scope.currentPage = 1;//当前页面
    $scope.itemsPerPage = 3;//每页显示条数
    $scope.init_spinner_display = true;
    $scope.role_id = $routeParams.role_id;
    function int_data()
    {
       RoleService.getDada($scope.search,$scope.currentPage,$scope.itemsPerPage).success(function(response){
            $scope.init_spinner_display = false;
            if(response.ret == 999){
                window.location = "/admin/login.html";
            }else if(response.ret == 0){
                $scope.list = response.data.data;
                $scope.currentPage = response.data.current_page;
                $scope.itemsPerPage = response.data.per_page;
                $scope.totalItems = response.data.total;
                $scope.numPages = response.data.last_page;
                $scope.init_spinner_display = false;
            }else{
                alert(response.msg);
            }
       });
    }
    int_data();

    $scope.role_edit = function()
    {
        $scope.btn_spinner_display = true;
        if($scope.role_id == 0){
            RoleService.role_add($scope.roleinfo).success(function (response) {
                if(response.ret == 0) {
                    $scope.btn_spinner_display = false;
                    $.modal.alert('角色添加成功!');
                } else {
                    $.modal.alert(response.msg);
                    $scope.btn_spinner_display = false;
                }
            });
        }else{
            $scope.roleinfo.id = $scope.role_id;
            RoleService.role_edit($scope.roleinfo).success(function (response) {
                if(response.ret == 0) {
                    $scope.btn_spinner_display = false;
                    $.modal.alert('角色修改成功!');
                } else {
                    $.modal.alert(response.msg);
                    $scope.btn_spinner_display = false;
                }
            });
        }
    }



    $scope.roleRemove = function(row)
    {
        $.modal.confirm('您确定要删除角色吗？', function()
        {
            RoleService.role_remove(row).success(function (response) {
                angular.forEach($scope.list, function(value,key,array){
                    if(value.id == response.data.id) {
                        array.splice(key, 1);
                    }
                });
                $.modal.alert('删除成功!');
            });

        }, function(){});
    }


}).service('RoleService', ['$http', function ($http) {

    var getDada = function (search,currentPage,itemsPerPage) {
        var url = '/api/admin/role_list';
        var data = {search:search,page:currentPage,itemsPerPage:itemsPerPage};
        return $http.post(url, data);
    };

    var role_add = function (roleinfo) {
        var url = '/api/admin/role_add';
        var data = {roleinfo:roleinfo};
        return $http.post(url, data);
    };

    var role_edit = function (roleinfo) {
        var url = '/api/admin/role_edit';
        var data = {roleinfo:roleinfo};
        return $http.post(url, data);
    };

    var role_remove = function (roleinfo) {
        var url = '/api/admin/role_remove';
        var data = {roleinfo:roleinfo};
        return $http.post(url, data);
    };

    return {
        getDada: function (search,currentPage,itemsPerPage) {
            return getDada(search,currentPage,itemsPerPage);
        },
        role_add: function (roleinfo) {
            return role_add(roleinfo);
        },
        role_edit: function (roleinfo) {
            return role_edit(roleinfo);
        },
        role_remove: function (roleinfo) {
            return role_remove(roleinfo);
        }
    };
}]);




angular.module('myApp').controller('UsersCtrl', function($scope, UsersService, $location, $routeParams , $uibModal) {
    $scope.currentPage = 1;//当前页面
    $scope.itemsPerPage = 20;//每页显示条数
    $scope.roleList = [];//角色列表初始化
    $scope.init_spinner_display = true;
    $scope.user_id = $routeParams.user_id;
    function int_data()
    {
       UsersService.getDada($scope.search,$scope.currentPage,$scope.itemsPerPage).success(function(response){
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
    $scope.pageChanged = function() 
    {
        int_data();
    };

    $scope.query_click = function()
    {   
        int_data();
    };


    //获取角色列表
    $scope.role_list_get = function()
    {
        UsersService.role_list_get().success(function (response) {
            console.log(JSON.stringify(response));
            $scope.roleList = response;
        });
        
    }
    $scope.role_list_get();

    $scope.useraddModal =function()
    {
        $.modal({
            contentAlign: 'center',
            title: 'Modal window',
            content: $('.useradd_modal').html(),
            resizable: false,
            actions: {},
            buttons: {

                '取消' : {
                    classes :   'green-gradient',
                    click :     function(modal) { modal.closeModal(); }
                },
                '确定': {
                        classes:    'button blue-gradient glossy',
                        click:      function(win) { 
                            alert($scope.usersinfo);
                        }
                }

            },
        });
    }


    $scope.user_info_add = function()
    {  
        $scope.btn_spinner_display = true;

        UsersService.users_add($scope.usersinfo).success(function (response) {
            if(response.ret == 0) {
                $scope.btn_spinner_display = false;
                $.modal.alert('添加成功!');
            } else {
                $.modal.alert(response.msg);
                $scope.btn_spinner_display = false;
            }
        });
        
    }

    $scope.usersRemoveModal = function(row)
    {
        $.modal.confirm('您确定要删除该账号？', function()
        {
            UsersService.users_remove(row).success(function (response) {
                angular.forEach($scope.list, function(value,key,array){
                    if(value.id == response.data.id) {
                        array.splice(key, 1);
                    }
                });
                $.modal.alert('删除成功');
            });

        }, function(){});
    }


    $scope.user_pass_edit = function(row)
    {
        $scope.btn_spinner_display = false;
        if($scope.users.password1 != $scope.users.password2){
            $.modal.alert('密码输入不一致');
            return false;
        }
        $scope.btn_spinner_display = true;
        $scope.users.id = $scope.user_id;
        UsersService.users_password($scope.users).success(function (response) {
            if(response.ret == 0) {
                $scope.btn_spinner_display = false;
                $.modal.alert("密码修改成功");
            } else {
                $.modal.alert(response.msg);
                $scope.btn_spinner_display = false;
            }
        });
        
    }


    $scope.user_role_edit = function()
    {
        $scope.btn_spinner_display = true;
        $scope.usersinfo.id = $scope.user_id;
        UsersService.users_role_edit($scope.usersinfo).success(function (response) {
            if(response.ret == 0) {
                $scope.btn_spinner_display = false;
                $.modal.alert("角色修改成功");
            } else {
                $.modal.alert(response.msg);
                $scope.btn_spinner_display = false;
            }
        });
    }


}).service('UsersService', ['$http', function ($http) {
    var getDada = function (search,currentPage,itemsPerPage) {
        var url = '/api/admin/users_list';
        var data = {search:search,page:currentPage,itemsPerPage:itemsPerPage};
        return $http.post(url, data);
    };

   var users_add = function (usersinfo) {
        var url = '/api/admin/users_add';
        var data = {usersinfo:usersinfo};
        return $http.post(url, data);
    };

    var users_edit = function (usersinfo) {
        var url = '/api/admin/users_edit';
        var data = {usersinfo:usersinfo};
        return $http.post(url, data);
    };

    var users_remove = function(usersinfo)
    {
        var url = '/api/admin/users_remove';
        var data = {usersinfo:usersinfo};
        return $http.post(url, data);
    }

    var users_password = function(users)
    {
        var url = '/api/admin/users_password';
        var data = {users:users};
        return $http.post(url, data);
    }

    var role_list_get = function()
    {
        var url = '/api/admin/role_list_get';
        var data = {};
        return $http.post(url, data);
    }

    var users_role_edit = function(usersinfo)
    {
        var url = '/api/admin/users_role_edit';
        var data = {usersinfo:usersinfo};
        return $http.post(url, data);
    }

    return {
        getDada: function (search,currentPage,itemsPerPage) {
            return getDada(search,currentPage,itemsPerPage);
        },
        users_add: function (usersinfo) {
            return users_add(usersinfo);
        },
        users_edit: function (usersinfo) {
            return users_edit(usersinfo);
        },
        users_remove: function (usersinfo) {
            return users_remove(usersinfo);
        },
        users_password: function (usersinfo,users) {
            return users_password(usersinfo,users);
        },
        role_list_get: function () {
            return role_list_get();
        },
        users_role_edit: function (usersinfo) {
            return users_role_edit(usersinfo);
        }
        
    };
}]);






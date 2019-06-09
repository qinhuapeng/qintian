angular.module('myApp').controller('PasswordCtrl', function($scope, PasswordService, $location, $routeParams , $uibModal) {
	$scope.usersinfo = {};
	$scope.confirm = function()
	{	
		if($scope.usersinfo.password1 == undefined){
			return false;	
		}

		if($scope.usersinfo.password1 != $scope.usersinfo.password2){
			$.modal.alert("密码不一致！");
			return false;	
		}

	    $scope.btn_spinner_display = true;
	    PasswordService.update_password($scope.usersinfo).success(function(response){
	        if(response.ret == 999){
	            window.location = "/admin/login.html";
	        }else if(response.ret == 0){
	        	$.modal.alert(response.msg);
	        }else{
	            $.modal.alert(response.msg);
	        }
	        $scope.btn_spinner_display = false;
	   });
	}

}).service('PasswordService', ['$http', function ($http) {
    var update_password = function (usersinfo) {
        var url = '/api/admin/update_password';
        var data = {usersinfo:usersinfo};
        return $http.post(url, data);
    };

    return {
        update_password: function (usersinfo) {
            return update_password(usersinfo);
        }
    
    };
}]);






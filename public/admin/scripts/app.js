(function(angular) {
    'use strict';

    //路由
    angular.module('myApp', ['ngRoute', 'oc.lazyLoad', 'commonDirectives','rt.select2','ui.bootstrap', 'ngSanitize', 'ngCookies',"dndLists", "ngCsv"])
        .config(function($routeProvider, $locationProvider) {
            var version = 20180416;
            $routeProvider.
            when('/overview', {
                templateUrl: 'views/overview.html',
                controller: 'overviewCtrl',
                resolve: {
                    deps: ["$ocLazyLoad", function (a) {
                        return a.load(["scripts/overview.js"])
                    }]
                }
            }).

            when('/users_list', {
                templateUrl: 'views/users_list.html',
                controller: 'UsersCtrl',
                resolve: {
                    deps: ["$ocLazyLoad", function (a) {
                        return a.load(["scripts/users_list.js"
                                      ])
                    }]
                }
            }).

            when('/users_list_add', {
                templateUrl: 'views/users_list_add.html',
                controller: 'UsersCtrl',
                resolve: {
                    deps: ["$ocLazyLoad", function (a) {
                        return a.load(["scripts/users_list.js",
                                      ])
                    }]
                }
            }).

            when('/users_list_role/:user_id', {
                templateUrl: 'views/users_list_role.html',
                controller: 'UsersCtrl',
                resolve: {
                    deps: ["$ocLazyLoad", function (a) {
                        return a.load(["scripts/users_list.js",
                                      ])
                    }]
                }
            }).

            when('/users_list_pass/:user_id', {
                templateUrl: 'views/users_list_pass.html',
                controller: 'UsersCtrl',
                resolve: {
                    deps: ["$ocLazyLoad", function (a) {
                        return a.load(["scripts/users_list.js",
                                      ])
                    }]
                }
            }).
            when('/jurisdiction_list', {
                templateUrl: 'views/jurisdiction_list.html',
                controller: 'JurisdictionCtrl',
                resolve: {
                    deps: ["$ocLazyLoad", function (a) {
                        return a.load(["scripts/jurisdiction_list.js"])
                    }]
                }
            }).

            when('/role_list', {
                templateUrl: 'views/role_list.html',
                controller: 'RoleCtrl',
                resolve: {
                    deps: ["$ocLazyLoad", function (a) {
                        return a.load(["scripts/role_list.js"])
                    }]
                }
            }).

            when('/role_list_edit/:role_id', {
                templateUrl: 'views/role_list_edit.html',
                controller: 'RoleCtrl',
                resolve: {
                    deps: ["$ocLazyLoad", function (a) {
                        return a.load(["scripts/role_list.js"])
                    }]
                }
            }).

            when('/password', {
                templateUrl: 'views/password.html',
                controller: 'PasswordCtrl',
                resolve: {
                    deps: ["$ocLazyLoad", function (a) {
                        return a.load(["scripts/password.js"])
                    }]
                }
            }).

            
            when('/push_msg', {
                templateUrl: 'views/push_msg.html',
                controller: 'PushmsgCtrl',
                resolve: {
                    deps: ["$ocLazyLoad", function (a) {
                        return a.load(["scripts/push_msg.js"])
                    }]
                }
            }).

            when('/chat_room', {
                templateUrl: 'views/chat_room.html',
                controller: 'ChatroomCtrl',
                resolve: {
                    deps: ["$ocLazyLoad", function (a) {
                        return a.load(["scripts/chat_room.js"])
                    }]
                }
            }).

            otherwise({redirectTo: '/overview'});
        }
    ).controller("indexCtr", function($scope, $http, $filter, $cookieStore, $interval, indexService) {

        if ($cookieStore.get("username") == undefined) {
            window.location = "/admin/login.html";
            return;
        }
        // $scope.$on('$viewContentLoaded', function(){
            // angular.element("#mainSideMenu li ul li").on('click',function (el) {
            //     $("#mainSideMenu li ul li").removeClass("active");
            //     $("#mainSideMenu li ul").removeClass("in");
            //     $("#mainSideMenu li div").removeClass("active");
            //     $(this).addClass('active');
            //     $(this).parent().addClass('in');
            //     $(this).parent().prev().addClass('active');
            // });
        //});



        
   
        indexService.check_login().success(function (data) {
            if (data.ret == 999) {
                window.location = "/admin/login.html";
                return;
            } else if (data.ret == 0) {
                $scope.menuslist = data.menuslist;
            } else {

            }
        });
        
        
    }).service('indexService', ['$http', function ($http) {
        $('.navigable li ul li').click(function(){
            $('.navigable li ul li a').removeClass('current navigable-current');
            $(this).find('a').addClass('current navigable-current');
        });

        var hash = window.location.hash;
        $('.navigable li ul li a').each(function(){
            var fdStart = hash.indexOf($(this).attr('href'));
            if(fdStart == 0){
                $('.navigable li ul li a').removeClass('current navigable-current');
                $(this).addClass('current navigable-current');
            }
        });


        var check_login = function () {
            var url = '/api/users/check_login';
            var data = {};
            return $http.get(url, data);
        };

        return {
            check_login: function () {
                return check_login();
            }
        };
        
    }]);


    //公共的directive
    angular.module('commonDirectives', []).
        directive('appUsername', ['$cookieStore', function($cookieStore) {
            return function(scope, elm, attrs) {
                elm.text($cookieStore.get("username"));
            };
        }]).

        directive('appRolename', ['$cookieStore', function($cookieStore) {
            return function(scope, elm, attrs) {
                elm.text($cookieStore.get("rolename"));
            };
        }]).

        directive('myAccess', [ 'removeElement', '$cookieStore', '$window', function (removeElement, $cookieStore, $window) {
            return{
                restrict: 'A',
                link: function (scope, element, attributes) {
                    var hasAccess = false;
                    
                    angular.forEach(JSON.parse($window.localStorage["access"] || '[]'), function (permission) {
                        if(attributes.myAccess == permission) {
                            hasAccess = true;
                        }
                    });

                    if (!hasAccess) {
                        angular.forEach(element.children(), function (child) {
                            removeElement(child);
                        });
                        removeElement(element);
                    }
                }
            }
        }]).
        directive('myDrop', [ 'removeElement', '$cookieStore', '$window', function (removeElement, $cookieStore, $window) {
            return{
                restrict: 'A',
                link: function (scope, element, attributes) {
                    var hasDrop = false;
                    angular.forEach(JSON.parse($window.localStorage["permissions"] || '[]'), function (permission) {
                        if(attributes.myDrop == permission) {
                            hasDrop = true;
                        }
                    });

                    if (hasDrop) {
                        angular.forEach(element.children(), function (child) {
                            removeElement(child);
                        });
                        removeElement(element);
                    }
                }
            }
        }]).
        directive('paraSection', ['$cookieStore', function($cookieStore) {
            return{
                restrict: 'A',
                link: function (scope, element, attributes) {
                    console.debug(element)
                }
            }
        }]).constant('removeElement', function(element){
            element && element.remove && element.remove();
        }).
        
        directive('myLaydate', function() {
        　　return {
        　　　　require: '?ngModel',
        　　　　restrict: 'A',
        　　　　scope: {
        　　　　　　ngModel: '='　
        　　　　},
        　　　　link: function(scope, element, attr, ngModel) {
        　　　　　　var _date = null,_config={};
        　　　　　　_config = {
        　　　　　　　　lang: 'ch',
        　　　　　　　　elem: element[0],
        　　　　　　　　btns:['clear','confirm'],
        　　　　　　　　format: !!attr.format ? attr.format : 'yyyy-MM-dd HH:mm:ss',
        　　　　　　　　range: attr.range,
                      type:'datetime',
        　　　　　　　　done: function(value, date, endDate) {
                          console.log(JSON.stringify(value));
        　　　　　　　　　　ngModel.$setViewValue(value);
        　　　　　　　　}
        　　　　　　};
        　　　　　　!!attr.typeDate && (_config.type = attr.typeDate);

        　　　　　　 _date = laydate.render(_config);
        　　　
        　　　　　　ngModel.$render = function() {
        　　　　　　　　element.val(ngModel.$viewValue || '');
        　　　　　　};
        　　　　}
        　　}
        })

        .directive('singleFileSelect', ['$window', function ($window) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, el, attr, ctrl) {
                    var fileReader = new $window.FileReader();
                    var res = {};

                    fileReader.onload = function () {
                        res.data = fileReader.result;
                        ctrl.$setViewValue(res);

                        if ('fileLoaded' in attr) {
                            scope.$eval(attr['fileLoaded']);
                        }
                    };

                    fileReader.onprogress = function (event) {
                        if ('fileProgress' in attr) {
                            scope.$eval(attr['fileProgress'], {'$total': event.total, '$loaded': event.loaded});
                        }
                    };

                    fileReader.onerror = function () {
                        if ('fileError' in attr) {
                            scope.$eval(attr['fileError'], {'$error': fileReader.error});
                        }
                    };

                    var fileType = attr['singleFileSelect'];

                    el.bind('change', function (e) {
                        var fileName = e.target.files[0];

                        res.file = fileName;

                        if (fileType === '' || fileType === 'text') {
                            fileReader.readAsText(fileName);
                        } else if (fileType === 'data') {
                            fileReader.readAsDataURL(fileName);
                        }

                    });
                }
            };
        }])

        .directive('multipleFileSelect', ['$window', function ($window) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, el, attr, ctrl) {
                    var fileType = attr['multipleFileSelect'];
                    el.bind('change', function (e) {
                        var res = {
                            "file":[],
                            "data":[]
                        };

                        var fileLen = e.target.files.length;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                        
                        for (var i=0;i<fileLen;i++) {
                            var fileReader = new $window.FileReader(); 
                            var fileName = e.target.files[i];
                            console.log(fileName);
                            //res.file = fileName;
                            res.file.push(fileName);
                            fileReader.readAsDataURL(fileName);

                            fileReader.onload = function (e) {
                                res.data.push(e.target.result);
                                ctrl.$setViewValue(res); 
                            };
                            
                              
                        }

                        
                    });
                }
            };
        }])

})(window.angular);

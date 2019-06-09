<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

//管理员登录
Route::any('api/users/login', 'UsersController@login');
Route::any('api/users/logout', 'UsersController@logout');
Route::any('api/users/check_login', 'UsersController@check_login');

//管理员详情
Route::any('api/admin/users_list', 'AdminController@users_list');
Route::any('api/admin/users_add', 'AdminController@users_add');
Route::any('api/admin/users_edit', 'AdminController@users_edit');
Route::any('api/admin/users_remove', 'AdminController@users_remove');
Route::any('api/admin/users_password', 'AdminController@users_password');
Route::any('api/admin/users_role_edit', 'AdminController@users_role_edit');

Route::any('api/admin/role_list', 'AdminController@role_list');
Route::any('api/admin/role_add', 'AdminController@role_add');
Route::any('api/admin/role_edit', 'AdminController@role_edit');
Route::any('api/admin/role_remove', 'AdminController@role_remove');
Route::any('api/admin/jurisdiction_list', 'AdminController@jurisdiction_list');
Route::any('api/admin/role_select_jurisdiction', 'AdminController@role_select_jurisdiction');
Route::any('api/admin/role_add_jurisdiction', 'AdminController@role_add_jurisdiction');
Route::any('api/admin/update_password', 'AdminController@update_password');
Route::any('api/admin/role_list_get', 'Controller@role_list_get');
//websocket
Route::any('api/websocket/users_list', 'WebsocketController@users_list');
Route::any('api/websocket/push_msg', 'WebsocketController@push_msg');


//公司详情
Route::any('api/company/company_info', 'CompanyController@company_info');
Route::any('api/company/company_edit', 'CompanyController@company_edit');
Route::any('api/company/lna_list', 'CompanyController@lna_list');
Route::any('api/company/lna_edit', 'CompanyController@lna_edit');
Route::any('api/company/damp4m_list', 'CompanyController@damp4m_list');
Route::any('api/company/damp4m_edit', 'CompanyController@damp4m_edit');
Route::any('api/company/material_list', 'CompanyController@material_list');
Route::any('api/company/material_list_add', 'CompanyController@material_list_add');
Route::any('api/company/material_list_modify', 'CompanyController@material_list_modify');
Route::any('api/company/material_list_one', 'CompanyController@material_list_one');
Route::any('api/company/material_list_remove', 'CompanyController@material_list_remove');
Route::any('api/company/sound_absorption_coefficient_material_list', 'CompanyController@sound_absorption_coefficient_material_list');
Route::any('api/company/sound_absorption_coefficient_material_add', 'CompanyController@sound_absorption_coefficient_material_add');
Route::any('api/company/sound_absorption_coefficient_material_set', 'CompanyController@sound_absorption_coefficient_material_set');


//首页
Route::any('api/overview', 'HomeController@overview');


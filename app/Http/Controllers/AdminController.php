<?php
/**
 * Created by PhpStorm.
 * User: link
 * Date: 2016/4/25
 * Time: 15:22
 */

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Request;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Illuminate\Log\Writer;
use Auth;
use App\User;
use Crypt;
use Hash;

class AdminController extends Controller {

   	public $logs_path;
    function __construct() {
 		$this->logs_path = "admin";
    }


    public function users_list()
    {
         $params= $this->getAngularjsParam(true);
         //dd(DB::table('users')->get());
        $res['ret'] = 0;
        $res['msg'] = 'ok';
        $tabs = DB::table('users')
                ->leftJoin('users_roles','users_roles.user_id','=','users.id')
                ->leftJoin('roles','roles.id','=','users_roles.role_id')
                ->where('users.status',0)
                ->orderBy('users.id','desc')
                ->select(['users.*','roles.name as role_name','roles.id as role_id'])
                ->paginate($params["itemsPerPage"])
                ->toArray();
        $res['data'] = $tabs;
    END:
        return Response::json($res);
    }

    public function users_add()
    {
        $params = $this->getAngularjsParam(true);
        //dd($params);
        $usersinfo = $params['usersinfo'];
        $res['ret'] = 0;
        $res['msg'] = 'ok';
        $repeat_count = DB::table('users')->where('name',$usersinfo['name'])->where('status',0)->count();
        if($repeat_count > 0){
            $res['ret'] = 1;
            $res['msg'] = '该管理员账号已存在！'; 
            goto END;
        }

        $sqlData = array();
        $sqlData['name'] = $usersinfo['name'];
        $sqlData['email'] = $usersinfo['name'];
        $sqlData['password'] = Hash::make($usersinfo['password']);
        $lastId = DB::table('users')->insertGetId($sqlData);

        DB::table('users_roles')->insert(['user_id'=>$lastId,'role_id'=>$usersinfo['role_id']]);

        $role_name = $this->role_name();
        $this->logs($this->logs_path,("用户ID:".Auth::ID().",创建账号ID:".$lastId.":".$usersinfo['name'].",".$role_name[$usersinfo['role_id']]));

        $usersinfo['id'] = $lastId;
        $usersinfo['role_name'] = $role_name[$usersinfo['role_id']];
        $res['data'] = $usersinfo;
    END:
        return Response::json($res);
    }


    public function role_list()
    {
        $params = $this->getAngularjsParam(true);
        $res['ret'] = 0;
        $res['msg'] = 'ok';
        $tabs = DB::table('roles')
                ->where('is_delete',0)
                ->select(['*'])
                ->paginate($params["itemsPerPage"])
                ->toArray();
        $res['data'] = $tabs;
    END:
        return Response::json($res);
    }


    public function role_add()
    {
        $params = $this->getAngularjsParam(true);
        $res['ret'] = 0;
        $res['msg'] = 'ok';
        //dd($params);
        $roleinfo = $params['roleinfo'];
        $repeat_count = DB::table('roles')->where('name',$roleinfo['name'])->count();
        if($repeat_count > 0){
            $res['ret'] = 1;
            $res['msg'] = '该角色名称已存在！'; 
            goto END;
        }
        $lastId = DB::table('roles')->insertGetId(array("name"=>$roleinfo['name']));
        $roleinfo['id'] = $lastId;
        $res['data'] = $roleinfo;
    END:
        return Response::json($res);
    }

    public function role_edit()
    {
        $params = $this->getAngularjsParam(true);
        //dd($params);
        $res['ret'] = 0;
        $res['msg'] = 'ok';
        $roleinfo = $params['roleinfo'];
        $repeat_count = DB::table('roles')->where('id','<>',$roleinfo['id'])->where('name',$roleinfo['name'])->count();
        if($repeat_count > 0){
            $res['ret'] = 1;
            $res['msg'] = '该角色名称已存在！'; 
            goto END;
        }
        DB::table('roles')->where('id',$roleinfo['id'])->update(array("name"=>$roleinfo['name']));
        $res['data'] = $roleinfo;
    END:
        return Response::json($res);
    }

    public function role_remove()
    {
        $params = $this->getAngularjsParam(true);
        //dd($params);
        $res['ret'] = 0;
        $res['msg'] = 'ok';
        $roleinfo = $params['roleinfo'];
        DB::table('roles')->where('id',$roleinfo['id'])->update(['is_delete'=>1]);
        $this->logs($this->logs_path,("用户ID:".Auth::ID()."，删除角色ID：".$roleinfo['id']));
        $res['data'] = $roleinfo;
    END:
        return Response::json($res);
    }


    public function jurisdiction_list()
    {
        $params = $this->getAngularjsParam(true);
        $res['ret'] = 0;
        $res['msg'] = 'ok';
        $data = array();
        $tabs = DB::table('jurisdictions')
                ->orderBy('parent','asc')
                ->get(['*']);
        foreach ($tabs as $key => $value) {
            if($value->parent == 0){
                $data[$key]['id'] = $value->id;
                $data[$key]['name'] = $value->name;
                $data[$key]['child'] = array();
            }
        }

        foreach ($data as $key => $value) {
            foreach ($tabs as $k => $val) {
                if($val->parent == $value['id']){
                    array_push($data[$key]['child'], array('id'=>$val->id,'name'=>$val->name));
                }
            }
        }

        $res['data'] = $data;
    END:
        return Response::json($res);
    }

    public function users_remove()
    {
        $params = $this->getAngularjsParam(true);
        $res['ret'] = 0;
        $res['msg'] = 'ok';
        DB::table('users')->where('id',$params['usersinfo']['id'])->update(['status'=>1]);
        $this->logs($this->logs_path,("用户ID:".Auth::ID()."，删除账户ID：".$params['usersinfo']['id']));
        $res['data'] = $params['usersinfo'];
    END:
        return Response::json($res);
    }

    public function users_password()
    {
        $params = $this->getAngularjsParam(true);
        $res['ret'] = 0;
        $res['msg'] = '密码修改成功';
        DB::table('users')->where('id',$params['users']['id'])->update(['password'=>Hash::make($params['users']['password1'])]);
        $this->logs($this->logs_path,("用户ID:".Auth::ID()."，修改账户ID：".$params['users']['id']."的密码：".$params['users']['password1']));
    END:
        return Response::json($res);
    }


    public function users_role_edit()
    {
        $params = $this->getAngularjsParam(true);
        //dd($params);
        $usersinfo = $params['usersinfo'];
        $res['ret'] = 0;
        $res['msg'] = '管理员角色修改成功';
        $tabs = DB::table('users_roles')->where('user_id',$usersinfo['id'])->update(['role_id'=>$usersinfo['role_id']]);

        $res['data'] = $params['usersinfo'];
    END:
        return Response::json($res);
    }


    public function role_select_jurisdiction()
    {
        $params = $this->getAngularjsParam(true);
        //dd($params);
        $usersinfo = $params['usersinfo'];
        $res['ret'] = 0;
        $res['msg'] = 'ok';
        $tabs = DB::table('roles_jurisdictions')->where('role_id',$usersinfo['role_id'])->get(['jurisdiction_id']);
        $res['data'] = $tabs;
    END:
        return Response::json($res);
    }

    public function role_add_jurisdiction()
    {
        $params = $this->getAngularjsParam(true);
        //dd($params);
        $usersinfo = $params['usersinfo'];
        $res['ret'] = 0;
        $res['msg'] = 'ok';
        DB::table('roles_jurisdictions')->where('role_id',$usersinfo['role_id'])->delete();
        foreach ($params['selected'] as $key => $value) {
            $sqlData = array();
            $sqlData['role_id'] = $usersinfo['role_id'];
            $sqlData['jurisdiction_id'] = $value;
            DB::table('roles_jurisdictions')->insert($sqlData);
        }
    END:
        return Response::json($res);
    }

    public function update_password()
    {
        $params = $this->getAngularjsParam(true);
        $usersinfo = $params['usersinfo'];
        $res['ret'] = 0;
        $res['msg'] = 'ok';
        DB::table('users')->where('id',Auth::id())->update(['password'=>Hash::make($usersinfo['password1'])]);
        $this->logs($this->logs_path,("用户ID:".Auth::id()."，个人设置密码：".$usersinfo['password1']));
    END:
        return Response::json($res);
    }

    





}

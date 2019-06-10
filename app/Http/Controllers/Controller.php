<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Monolog\Logger;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Formatter\LineFormatter;
use Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Request;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function __construct(){
    }

    
    //获取路由参数
    protected function getAngularjsParam($type = False)
    {
        $content = file_get_contents('php://input');
        return json_decode($content, $type);
    }

    //日志
    public function logs($filename,$note)
    {
		$logger = $this->getDailyFileLogger($filename);
        $logger->info($note);
        return TRUE;
    }


    public function getDailyFileLogger($filename) {
		$filepath = '';
		$logger = new Logger($filename);
		$filepath = storage_path() . '/logs/' . $filename .'/'.$filename.'.log';
		$handler = (new RotatingFileHandler($filepath))->setFormatter(new LineFormatter(null, null, true, true));
		$logger->pushHandler($handler);
		return $logger;
	}

    //角色列表名称
    public function role_name()
    {
        $data = array();
        $tabs = DB::table('roles')->where('is_delete',0)->get(['*']);

        foreach ($tabs as $key => $value) {
            $data[$value->id] = $value->name;
        }
        return $data;
    }

    //获取角色列表
    public function role_list_get(){
        $data = array();
        $tabs = DB::table('roles')->where('is_delete',0)->get(['*']);
        return $tabs;
    }
    
}

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

class HomeController extends Controller {

   	public $logs_path;
    function __construct() {
 		$this->logs_path = "admin";
    }


    public function overview()
    {
        $params= $this->getAngularjsParam(true);
        $res['ret'] = 0;
        $res['msg'] = 'ok';

        $order_list = array();
        $order_count = 0;
        $customer_list = array();
        $customer_count = 0;
        $product_list = DB::table('product_single')
                        // ->where('product_up',1)
                        ->orderBy('id','desc')
                        ->limit(5)
                        ->get(['*']);
        $product_count = DB::table('product_single')
                        ->where('product_up',1)
                        ->count(['*']);
        $user_count = DB::table('users')
                        ->count(['*']);
        $res['order_list'] = $order_list;
        $res['order_count'] = $order_count;
        $res['customer_list'] = $customer_list;
        $res['customer_count'] = $customer_count;
        $res['product_list'] = $product_list;
        $res['product_count'] = $product_count;
        $res['user_count'] = $user_count;
        

    END:
        return Response::json($res);
    }







}

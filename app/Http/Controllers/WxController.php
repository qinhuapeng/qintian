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
use App\Tools\Tools;
use Illuminate\Support\Facades\Cache;


class WxController extends Controller {

    public $logs_path;
    public $appid;
    public $appsecret;
    function __construct() {
        $this->logs_path = "wx";
        $this->appid = getenv("WX_APPID");
        $this->appsecret = getenv("WX_APPSECRET");
    }

    public function get_access_token()
    {
        if (Cache::has('access_token')) {
            $access_token = Cache::get('access_token');
        }else{
            $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$this->appid."&secret=".$this->appsecret;
            $jsonData = Tools::curl_get($url,15);
            $result = json_decode($jsonData,true);
            Cache::put('access_token', $result['access_token'], ($result['expires_in'])/60);
            $access_token =$result['access_token']; 
        }
        return $access_token;
    }



    public function get_jsapi_ticket()
    {
        if (Cache::has('jsapi_ticket')) {
            $result['errcode'] = 0;
            $result['ticket'] = Cache::get('jsapi_ticket');
        }else{
            $access_token = $this->get_access_token();
            $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=".$access_token."&type=jsapi";
            $jsonData = Tools::curl_get($url,15);
            $result = json_decode($jsonData,true);
            
            // {
            // "errcode":0,
            // "errmsg":"ok",
            // "ticket":"bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
            // "expires_in":7200
            // }
            if($result['errcode'] == 0){
                Cache::put('jsapi_ticket', $result['ticket'], ($result['expires_in'])/60);
            }
            
        }
        return $result;
    }



    public function get_nonceStr($length=16)
    {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for ($i = 0; $i < $length; $i++) {
          $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }
        return $str;
    }

    public function get_signature($jsapi_ticket,$nonceStr,$timestamp,$wxurl)
    {
        $string = "jsapi_ticket=".$jsapi_ticket."&noncestr=".$nonceStr."&timestamp=".$timestamp."&url=".$wxurl;
        $signature = sha1($string);
        return $signature;
    }

    public function get_WX_config()
    {
        $res['ret'] = 0;
        $res['msg'] = 'ok';
        $params = $this->getAngularjsParam(true);
        $jsapi_ticket_result = $this->get_jsapi_ticket();
        if($jsapi_ticket_result['errcode'] != 0){
            $res['ret'] = -1;
            $res['msg'] = 'jsapi_ticket_err';
            goto END;
        }else{
            $jsapi_ticket = $jsapi_ticket_result['ticket'];
        }
        $timestamp = time();
        $nonceStr = $this->get_nonceStr();   
        //$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";   
        $wxurl = $params['wxurl']; 
        $signature = $this->get_signature($jsapi_ticket,$nonceStr,$timestamp,$wxurl);
        $res['data'] = array('appid'=>$this->appid,'timestamp'=>$timestamp,'nonceStr'=>$nonceStr,'signature'=>$signature);
    END:
        return Response::json($res);
    }


}

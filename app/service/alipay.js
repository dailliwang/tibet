/**
 * ali支付业务
 */
const path = require("path");
const Service = require('egg').Service;

//const Alipay = require("alipay-node-sdk");
const Alipay = require("../ali/alipay");

class AlipayService extends Service {
    //测试接口获取数据
    async getAliPay(req, res){
        let ali = new Alipay({
            appId: '2018060860318901',
            notifyUrl: 'http://tianlu.5uwifi.com:8081/sell/callback',
            rsaPrivate: path.resolve('./pem/sandbox_private.txt'),
            rsaPublic: path.resolve('./pem/sandbox_ali_public.txt'),
            sandbox: false,
            signType: 'RSA2'
        });
        let url = ali.wapPay({
            body: "商品描述字符",
            subject: "Iphone6 16G",
            outTradeId: "201712201451571513781517701",//商户网站唯一订单号
            timeout: '90m',
            amount: "0.01",
            goods_type: "1"//商品主类型：0—虚拟类商品，1—实物类商
        })

        console.log(url);
    
        let url_API = 'https://openapi.alipay.com/gateway.do?'+url;
        return url_API;
    };


    async getOrderAliPay(subject, description, myoutTradeId, allrmb, mac){
        let ali = new Alipay({
            appId: '2018060860318901',
            notifyUrl: 'http://tianlu.5uwifi.com:8081/sell/callback',
            rsaPrivate: path.resolve('./pem/sandbox_private.txt'),
            rsaPublic: path.resolve('./pem/sandbox_ali_public.txt'),
            sandbox: false,
            signType: 'RSA2'
        });
        var params = null;
        try {
            params = ali.wapPay({
                body: description,
                subject: subject,
                return_url: `http://tianlu.5uwifi.com:8081/buy/success?subject=${subject}&description=${description}&mac=${mac}`,
                outTradeId: myoutTradeId,
                timeout: '1d',
                amount: allrmb,
                goodsType: '0'
            });
        } catch (error) {
            console.log(error);
            return "";
        }
        
        console.log(params);
    
        let url_API = 'https://openapi.alipay.com/gateway.do?'+params;
        return url_API;
    }

    async query(myoutTradeId){
        let ali = new Alipay({
            appId: '2017122001025887',
            rsaPrivate: path.resolve('./pem/sandbox_private.txt'),
            rsaPublic: path.resolve('./pem/sandbox_ali_public.txt'),
            sandbox: false,
            signType: 'RSA2'
        });
        let result = ali.query({
            outTradeId: myoutTradeId    //商户网站唯一订单号
        });
    
        return result;
    };

    async refund(type, sell) {
        let outTradeNo = sell.tradeNumber,
            refundAmount = sell.totalRmb,
            tradeNo = sell.tradeNo;
        let ali = new Alipay({
            appId: '2017122001025887',
            notify_url: 'http://tianlu.5uwifi.com:8081/sell/callback',
            rsaPrivate: path.resolve('./pem/sandbox_private.txt'),
            rsaPublic: path.resolve('./pem/sandbox_ali_public.txt'),
            sandbox: false,
            signType: 'RSA2'
        });
    
        return ali.refund({
            outTradeId: outTradeNo,
            tradeId: tradeNo,
            refundAmount: refundAmount
        });
    
    }
}


module.exports = AlipayService;
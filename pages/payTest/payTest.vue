<template>
	<view>
		<button @click="weixinPay">支付</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			// 微信支付
			weixinPay() {
			    var that = this
			    // 1.传递weixin 获取微信的code
			    uni.login({
			        provider: 'weixin',
			        success(code) {
			            //console.log('code:', code.code) // 获得code
			            //2:获得微信openid
			            uni.request({
			                url: 'https://api.weixin.qq.com/sns/jscode2session', 
			                method:'GET',  
			                data: {  
			                appid: "wx1e656e3fd064719a", // 你的小程序的APPID 
			                secret: "58ddb3617f26ed6bdd4b4117046ae7a8",       //你的小程序的secret, 
			                js_code: code.code       //wx.login 登录成功后的code  
			                },  
			                success: (cts) => {  
			                    // cts.data.openid 拿到openid
			                    //3:调用云函数 统一下单
			                    uniCloud.callFunction({
			                        name: 'testPayOrder',
			                        data: { // 传递订单的一些基本信息
			                        openid: cts.data.openid,
			                        // name: that.order.name,
			                        // out_trade: that.order.out_trade, // 订单号
			                        out_trade: new Date().getTime(), // 订单号
			                        suiji: Math.floor(Math.random() * 100000000),
			                        pric: 1, // 单位分
			                    }
			                    }).then(odr => {
			                        //console.log('OrderInfo:', odr)
			                        uni.hideLoading(); //隐藏loding...
			                        uni.requestPayment({ // 调用支付api
			                        provider: 'weixin',
			                        ...odr.result.orderInfo,  
			                        success() {
			                            uni.showModal({
			                                title: '支付成功',
			                                content: '请和顾问联系执行订单即可!'
			                            })
			                        },
			                        fail() {}
			                    })
			                })
			            }  
			        }); 
			    },
			    fail(err) {
			        reject(new Error('微信登录失败'))
			    }
			})
			// 支付结束
						
			}
		}
	}
</script>

<style>

</style>

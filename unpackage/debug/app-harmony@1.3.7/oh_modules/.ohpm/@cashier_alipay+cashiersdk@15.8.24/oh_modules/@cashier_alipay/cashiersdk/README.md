## cashiersdk

---
## 隐私说明

https://opendocs.alipay.com/common/02kiq3

## 功能说明
- H5支付
- 唤起支付宝支付

## compileSdkVersion
12

## minSdkVersion
12

## 安装说明
```
ohpm install @cashier_alipay/cashiersdk
```

## 使用说明

### 基础说明
如果还没有接入过支付宝其他版本SDK，请参考文档：
https://opendocs.alipay.com/open/204/105051?pathHash=b91b9616&ref=api
进行服务端接入
### 使用
1. 默认方式，H5通过router进行跳转
```typescript
// orderInfo 由服务端生成
// 第二个参数 控制是否展示支付宝loading        
new Pay().pay(orderInfo, true).then((result) => {
  let message =
    `resultStatus: ${result.get('resultStatus')} memo: ${result.get('memo')} result: ${result.get('result')}`;
  console.log(message);
}).catch((error: BusinessError) => {
  console.log(error.message);
});
```
2. 使用navigator进行跳转
```typescript
步骤一：通过调用payWithNav方法
- 第三个参数由sdk回调传入H5页面名称和需要传入到H5页面的参数，开发者自行进行nav跳转
- 第四个参数必传 ，传入 NavPathStack 实例    
        
 new Pay().payWithNav(orderInfo, true, (name: string, params: Object) => {
  this.pageInfos.pushPathByName(name, params);
}, this.pageInfos).then((result) => {
  let message =
    `resultStatus: ${result.get('resultStatus')} memo: ${result.get('memo')} result: ${result.get('result')}`;
  console.log(message);
}).catch((error: BusinessError) => {
  console.log(error.message);
});

步骤二： 在你的navigation的navDestination builder中配置对应页面
        
Navigation(this.pageInfos)...
        .navDestination(this.PagesMap)
        ...
@Builder
PagesMap(name: string, navPageIntent: Map<string, Object>) {
  if (name === 'alipay/cashier/H5Page') {
    // name 固定为这个，当然如果你的项目支持动态import的话可以使用回调中的name，二者值一致
    AlipayH5Page({ navPageIntent: navPageIntent })
  }
}

```

3. 使用navigator进行跳转，使用系统路由表
- 该方式依赖鸿蒙更新系统，预计6月底可用
```typescript
  new Pay().payWithNav(orderInfo, true, undefined, this.pageInfos).then((result) => {
  let message =
  `resultStatus: ${result.get('resultStatus')} memo: ${result.get('memo')} result: ${result.get('result')}`;
  console.log(message);
  }).catch((error: BusinessError) => {
  console.log(error.message);
  });
```

### 日志获取
```typescript
 Log.setupLogCallback((log) => {
      hilog.info(0x00, "sdk_demo", log);
    });
```

## demo下载
以下文档顶部的zip包就是demo
https://alidocs.dingtalk.com/i/nodes/qnYMoO1rWxrkmoj2IOpZR6yaJ47Z3je9?iframeQuery=utm_source%3Dportal%26utm_medium%3Dportal_recent&rnd=0.2928087218087806


## FAQ
1. 系统弹出唤端确认框，用户点击取消是否有回调？
> 没有回调，系统并未给出回调，sdk无法感知

2. 现在跳转H5是以什么方式？
>  使用.pay()接口，以router为默认跳转方式 
> 
>  使用.payWithNav() 接口，以navigator为默认跳转方式。已支持系统路由表，其中第三个参数可不传
> 
> 请根据自己的应用框架选用合适的方式。唤端的情况下，两个接口表现一致，无任何区别

3. 是否支持auth？
> 不支持，如果要接入auth能力，联系华为支持

4. 开放平台上目前还不能直接申请鸿蒙app，有什么办法接入吗？
> 可以先使用Android或者iOS的项目来申请，再在鸿蒙上进行接入
 

5. 服务端是否需要改造？
> 目前来看不需要。附支付产品文档：https://opendocs.alipay.com/open/204/105051?pathHash=b91b9616&ref=api


6.  遇到错误怎么排查
> Log.setupLogCallback((log) => {
hilog.info(0x00, "sdk_demo", log);
}); 过滤alipay_sdk日志，查看错误信息。目前99%都是订单串传入错误，请多检查订单串，是否和android传入到支付宝sdk中的一致。
> 
> 订单串用android验证之后不可以支付，再反馈问题

7. 是否支持商家扣款 - 独立签约（免密签约）、芝麻信用等？
> sdk不提供此项能力，请参考开放平台文档，生成对应唤端链接，进行唤端。附独立签约文档：https://opendocs.alipay.com/open/08ayiq?pathHash=a2d4e097
> 
> 如何唤端请参考鸿蒙官方文档 https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/uiability-startup-adjust-V5


8. 如何判断支付宝是否安装
> 华为文档 https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/canopenlink-V5  
> 
>对应支付宝scheme：'alipays://'

9. 如需反馈问题，请提供相关信息
> 1. appid(必须提供)
> 2. 订单串(如果方便的话)，不方便提供订单id也可
> 3. 问题发生的时间
> 4. 录屏(如果有的话)


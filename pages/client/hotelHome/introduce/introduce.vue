<template>
  <scroll-view class="introduce" :scroll-x="false" :scroll-y="true">
    <view class="barner">
      <swiper class="barner-swiper"  :indicator-dots="true" :autoplay="true" :interval="interval" :duration="duration" :circular="true" indicator-color="#FFF">
      <swiper-item v-for="item of hotel.imagesList">
         <image show-menu-by-longpress :src="item" class="barner-image" mode="aspectFill"></image>						
      </swiper-item>
    </swiper>
    </view>
    <view class="panal">
      <information></information>
    </view>
    <view class="dev-line"></view>
    <view class="panal">
      <view class="label-title">民宿介绍</view>
      <view style="text-indent:40rpx">
        <text>
          见山舍民宿位于浙江省湖州市德清县莫干山镇北湖村上下庄一号,依山而建，竹林环绕，环境优美，属于天然氧吧。距离莫干山风景区直线6公里，距裸心谷500米。民宿装修时尚高雅，设施齐全，环境舒适。民宿配备游泳池，棋牌室，KTV,餐饮包厢，草地天幕等设施。是家庭出行，团队建设的不二之选。
      </text>
    </view>
    </view>
    <view class="dev-line"></view>
    <view class="panal">
      <view class="label-title">设施服务</view>
      <servicesFacilities></servicesFacilities>
    </view>
  </scroll-view>
</template>

<script>
import information from './components/information';
import servicesFacilities from './components/servicesFacilities';
export default {
  name: "introduce",
  components:{
    information,
    servicesFacilities
  },
  props: {
    hotel:{
      type:Object
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {},
  // 组件周期函数--监听组件数据更新之前
  beforeUpdate() {},
  // 组件周期函数--监听组件数据更新之后
  updated() {},
  // 组件周期函数--监听组件激活(显示)
  activated() {},
  // 组件周期函数--监听组件停用(隐藏)
  deactivated() {},
  // 组件周期函数--监听组件销毁之前
  beforeDestroy() {},
}
</script>

<style scoped lang="scss">
$showWidth:1200px;
.introduce{
  height:calc(100vh - 70px);
  max-width:$showWidth;
  background-color:#f1f1f1
}
.barner{
	width: $showWidth;
	height: ($showWidth/16)*9;
}
.barner-swiper{
  width: $showWidth;
	height: ($showWidth/16)*9;
  box-sizing: border-box;
}
.barner-image{
	width: $showWidth;
	height: ($showWidth/16)*9;
}
.panal{
  padding: 20px;
  background: #fff;
  box-sizing: border-box;
  .label-title{
    margin-bottom: 10px;
    font-size: 40rpx;
    font-weight: bolder;
    color: rgb(177, 90, 31);
  }
}
.dev-line{
  height: 15px;
  background-color: transparent;
}
</style>
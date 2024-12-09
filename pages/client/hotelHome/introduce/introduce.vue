<template>
  <scroll-view class="scroll-style" :scroll-x="false" :scroll-y="true">
    <view class="introduce"> 

    
    <view class="barner">
      <swiper class="barner-swiper"  :indicator-dots="true" :autoplay="true"   :circular="true" indicator-color="#FFF">
      <swiper-item v-for="item of hotel.imagesList">
         <image show-menu-by-longpress :src="item" class="barner-image" mode="aspectFill"></image>						
      </swiper-item>
    </swiper>
    </view>
    <view class="panal">
      <information :hotel="hotel"></information>
    </view>
    <view class="dev-line"></view>
    <view class="panal">
      <view class="label-title">民宿介绍</view>
      <view style="text-indent:40rpx">
        <text>
          {{ hotel.hotelIntroduction }}
        </text>
    </view>
    </view>
    <view class="dev-line"></view>
    <view class="panal">
      <view class="label-title">设施服务</view>
      <servicesFacilities :hotel="hotel"></servicesFacilities>
    </view>
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
$showWidth:800px;
.scroll-style{
  height:calc(100vh - 70px);
}
.introduce{
  max-width: 100vw;
  width:$showWidth;
  margin:auto;
  background-color:#f1f1f1
}
.barner{
  max-width: 100vw;
  max-height:56.25vw ;
	height:$showWidth*0.0625*9;
  max-width: 100vw;
}
.barner-swiper{
  max-width: 100vw;
  max-height:56.25vw ;
  width: $showWidth;
	height: $showWidth*0.0625*9;
  box-sizing: border-box;
}
.barner-image{
  max-width: 100vw;
  max-height:56.25vw ;
	width: $showWidth;
	height: $showWidth*0.0625*9;
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
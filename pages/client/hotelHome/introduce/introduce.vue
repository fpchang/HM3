<template>
  <scroll-view scroll-x="false" scroll-y="true" style="height:calc(100vh - 70px);background-color:#f1f1f1">
    <view class="barner">
      <swiper style="width: 100%;height:100%"  :indicator-dots="true" :autoplay="true" :interval="interval"
      :duration="duration">
      <swiper-item v-for="item of hotel.imagesList">
         <image :src="item" class="barner-image" mode="aspectFill"></image>						
      </swiper-item>
    </swiper>
    </view>
    <view class="panal">
      <information></information>
    </view>
    <view class="dev-line"></view>
    <view class="panal">
      <view class="label-title">民宿介绍</view>
      <view style="text-indent:40rpx">{{introduce.introduce}}</view>
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
// import servicesFacilities from './components/servicesFacilities';
export default {
  name: "introduce",
  components:{
    information
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
.barner{
	width: 100vw;
	height: 75vw;
	max-width: 450px;
	max-height: 337.5px;
}
.barner-image{
	width: 100vw;
	height: 64vw;
	max-width: 450px;
	max-height: 337.5px;
}
.panal{
  padding: 20px;
  background: #fff;
  box-sizing: border-box;
}
.dev-line{
  height: 15px;
  background-color: transparent;
}
</style>
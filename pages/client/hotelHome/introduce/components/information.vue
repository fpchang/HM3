<template>
  <view class="information"> 
    <view class="hotel_label"><text>见山舍民宿舍</text></view>
    <view class="tab-container">
      <view class="tab" v-for="item in 5">莫干山景</view>
      <view style="height: 0;width:70px" v-for="item in 4"></view>
    </view>
    <view class="position-style">
      <view class="adone" bindtap="toMap">
        <!-- <van-icon name="location" color="green" size="40rpx" style="margin: 0rpx 10rpx -8rpx 0;" /> -->
         <uni-icons type="location-filled" size="20px" color="green"></uni-icons>
         <view class="la">浙江省湖州市莫干山镇北湖村上下庄一号</view>
      </view>
      <uni-icons style="margin-left: 30rpx;" type="weixin" size="30px" color="green" @click="toConcat"></uni-icons>
      <uni-icons style="margin-left: 30rpx;"  type="phone-filled" size="30px" color="green" @click="makePhone"></uni-icons>
    </view>
  </view>
  
</template>

<script>
import UniIcons from '../../../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
import uniTag from '../../../../../uni_modules/uni-tag/components/uni-tag/uni-tag.vue'
export default {
  components: { uniTag, UniIcons },
  name:"information",
  props: {},
  data() {
    return {}
  },
  computed: {},
  methods: {
    toConcat(){},
    makePhone(){}
  },
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
.information{

  .hotel_label{
    margin:10px 0;
    font-size: 40rpx;
    font-weight: bolder;
    color: rgb(177, 90, 31);
  }
  .tab-container{
    margin-top: 20rpx;
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    flex-wrap: wrap;
    gap: 8px;
    .tab{
      padding: 10rpx;
      background-color: rgb(177, 90, 31);
      color: #fff;
      border-radius: 10rpx;
    }
  }
  .position-style{
    margin-top:20px;
    display: flex;
    font-size: 12px;
     .adone{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding:15px;
      box-sizing: border-box;
      overflow: hidden;
      height: 40px;
      background-color: rgb(241, 241, 241);
      border-radius: 20px;
      flex: 1;
      .la{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
     
  }
}
</style>
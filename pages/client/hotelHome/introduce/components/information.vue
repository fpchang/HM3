<template>
  <view class="information"> 
    <view class="hotel_label"><text>{{hotel.hotelName}}介绍</text></view>
    <view class="tab-container">
      <view class="tab" v-for="item of  feature">{{item}}</view>
      <view style="height: 0;width:70px" v-for="item in 4"></view>
    </view>
    <view class="position-style">
      <view class="adone" @click="toMap">
         <uni-icons type="location-filled" size="20px" color="green"></uni-icons>
         <view class="la">{{hotel.hotelAddressArea}}{{hotel.hotelAddress}}</view>
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
  props: {
    hotel:{
      type:Object
    }
  },
  setup(){
   
  },
  data() {
    return {}
  },
  computed: {
    feature(){
      return this.hotel.feature ||[];
    },
    phone(){
      return this.$store.state.user.phone
    }
  },
  methods: {
    toMap(){
      console.log(111);
      uni.navigateTo({url:"/pages/client/map/pathPlaining/pathPlaining"})
    },
    toConcat(){
      if(!this.hotel.wechat){
        uni.showToast({title:"无微信号"});
        return;
      }
      uni.setClipboardData({
        data: this.hotel.wechat,
        success: function () {
          console.log("success");
        },
      });
    },
    makePhone() {
      let deviceType = uni.getSystemInfoSync().deviceType;
      if(!this.hotel.serviceTel){
        uni.showToast({title:"无客服电话"});
        return;
      }
      if (deviceType == "phone") {
        uni.makePhoneCall({
          phoneNumber: this.hotel.serviceTel, //仅为示例
          success: (success) => {
            console.log("调用成功", success);
          },
        });
        return;
      }
      uni.setClipboardData({
        data: this.hotel.serviceTel,
        success: function () {
          console.log("success");
        },
      });
    },
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
    font-size:16px;
    font-weight: bolder;
    color: rgb(177, 90, 31);
  }
  .tab-container{
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    flex-wrap: wrap;
    gap: 8px;
    .tab{
      padding:5px;
      background-color: rgb(177, 90, 31);
      color: #fff;
      border-radius: 5px;
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
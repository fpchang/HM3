<template>
  <view class="page-container">
    <view style="display: flex;justify-content:flex-end;padding:10px"> 
      <view class="switch" @click="switchEvent"> 
        <image v-if="config.cloudUrl" :src="`${config['cloudUrl']}/HM/images/miniprogram/line_switch_white.png`" style="width:20px;height:20px"></image><text>切换商家端</text>
      </view>      
    </view>
    <view class="c-p">
      <view class="container">
        <view class="xt-list">
          <view class="xt-list-item">
            <view class="item-con">
              <text>{{ addressName }}</text>
              <text class="flex-center" @click="getLocation"
                ><uni-icons type="location-filled" size="20"></uni-icons
                ><text>我的位置</text></text
              >
            </view>
          </view>
          <view class="xt-list-item">
            <view class="item-con">
              <view>
               
                <uni-datetime-picker v-model="dateRange" type="daterange" return-type="timestamp" @change="dateConfim" >
                  <text class="strong">{{foramtDateLabel(dateRange[0]).de}}</text
                  ><text class="normal" style="padding: 0 10px">{{foramtDateLabel(dateRange[0]).dy}}</text>
                  <text style="padding: 0 25px">-</text>
                  <text class="strong">{{foramtDateLabel(dateRange[1]).de}}</text
                  ><text class="normal" style="padding: 0 10px">{{foramtDateLabel(dateRange[1]).dy}}</text>
                </uni-datetime-picker>
              </view>
              <text class="flex-center">共1晚</text>
            </view>
          </view>
          <view class="xt-list-item">
            <view class="item-con">
              <uni-easyinput
                v-model="filterVal"
                placeholder="酒店名/品牌名/地标"
                style="font-size: 18px; font-weight: bold"
                :inputBorder="false"
              />
            </view>
          </view>
          <view class="xt-list-item">
            <button
              class="submit-btn $font-color-control"
              @click="getHotelList"
            >
              查找
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import amap from "../../../common/amap-wx.130";
import { DB } from "../../../api/DB";
import { HotelServiceClient } from "../../../services/HotelServiceClient";
import UniIcons from '../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
export default {
  components: {UniIcons},
  data() {
    return {
      isLoading: false,
      amapPlugin: null,
      key: "a69cc73276ceb1a813f3be0d5d42c2aa",
      filterVal: "",
      addressName: "",
      dateRange:[new Date().getTime(),new Date().getTime()+1000*60*60*24],
      location: []

    };
  },
  computed:{
    config(){
      return this.$store.state.config;
    }
  },
  onShow() {
    uni.setTabBarItem({index:1,visible:false});
    uni.setTabBarItem({index:0,visible:false});
  },
  async onLoad() {
    console.log("client onload");
   
    this.isLoading = true;
    await this.getLocation();
    this.isLoading = false;
  },
  mounted(){
    
  },
  methods: {
    switchEvent(){
      uni.setStorageSync("userRole","hotel");
      uni.reLaunch({
        url:"/pages/home/home"
      })
    },
    foramtDateLabel(dateTime){
      let dyStr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
					return {
						de: new Date(dateTime).Format("MM-dd"),
						dy: dyStr[new Date(dateTime).getDay()]
					}
				
    },
    dateConfim(e){
      console.log(e)
    },
    getLocation() {
      return true;
      // #ifdef H5
      return true;
      // #endif
      return new Promise((resolve, reject) => {
        this.amapPlugin = new amap.AMapWX({
          key: this.key,
        });
        this.amapPlugin.getRegeo({
          success: (data) => {
            console.log(data);
            this.addressName = data[0].name;
            this.location = [data[0].longitude, data[0].latitude];
            uni.hideLoading();
            resolve();
          },
          fail: (e) => {
            this.isLoading = false;
            console.log(e);
            reject(e);
          },
        });
      });
    },
    async getHotelList() {
      if (this.isLoading) {
        console.log("isloading....");
        return;
      }
      uni.showLoading();
      try {
        const res = await this.$store.dispatch(
          "hotelClientStore/getHotelList",
          {
            location: [119.882659, 30.626099],
            maxDistance: 5000,
            filterVal: this.filterVal,
          }
        );
        console.log(res);
        const condition={
          filterVal:this.filterVal,
          addressName: this.addressName,
          dateRange:this.dateRange,
          location:this.location,
        }
        uni.navigateTo({
          url: `/pages/client/client_hotelList/client_hotelList?condition=${encodeURIComponent(JSON.stringify(condition))}`,
        });
        uni.hideLoading();
      } catch (error) {
        console.log(error);
        uni.hideLoading();
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.switch{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  padding:4px 8px;
  box-sizing: border-box;
  background: #000;
  border-radius: 20px;
  color:#fff;
  gap:4px;
  font-size: 12px;
  cursor: pointer;
  &:hover{
    box-shadow: 0 0 13px 1px #d9d9d9;
  }
}
.page-container {
  height: 100vh;
  background-color: #eee;
}
.submit-btn {
  background: #06c;
  border-radius: 22.5px;
  color: #fff !important;
  cursor: pointer;
}
.c-p {
  max-width: 450px;
  padding: 20px;
  margin: auto;
}
.container {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
}
.xt-list {
  .xt-list-item {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    box-sizing: border-box;
    .item-con {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .strong {
        font-size: 18px;
        font-weight: bold;
      }
      .normal {
        font-size: 13px;
        color: #a1a1a1;
      }
    }
  }
}
</style>

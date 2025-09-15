<template>
  <view class="home flex-page">
    <view class="flex-page-content">
      <block v-if="tabId == 'b1'">
        <view class="page-container">
          <view style="display: flex; justify-content: flex-end; padding: 10px">
            <view class="switch" @click="switchEvent">
              <image
                v-if="config.cloudUrl"
                :src="`${config['cloudUrl']}/HM/images/miniprogram/line_switch_white.png`"
                style="width: 20px; height: 20px"
              ></image
              ><text>切换商家端</text>
            </view>
          </view>
          <view class="c-p">
            <view class="container">
              <view class="xt-list">
                <view class="xt-list-item">
                  <view class="item-con">
                    <text>{{ searchCondition.address }}</text>
                    <text class="flex-center" @click="getLocation"
                      ><uni-icons type="location-filled" size="20"></uni-icons
                      ><text>我的位置</text></text
                    >
                  </view>
                </view>
                <view class="xt-list-item">
                  <view class="item-con">
                    <view>
                      <uni-datetime-picker
                     
                        type="daterange"
                        return-type="timestamp"
                        @change="dateConfim"
                      >
                        <text class="strong">{{
                          foramtDateLabel(searchDateRange[0]).de
                        }}</text
                        ><text class="normal" style="padding: 0 10px">{{
                          foramtDateLabel(searchDateRange[0]).dy
                        }}</text>
                        <text style="padding: 0 25px">-</text>
                        <text class="strong">{{
                          foramtDateLabel(searchDateRange[1]).de
                        }}</text
                        ><text class="normal" style="padding: 0 10px">{{
                          foramtDateLabel(searchDateRange[1]).dy
                        }}</text>
                      </uni-datetime-picker>
                    </view>
                    <text class="flex-center">共1晚</text>
                  </view>
                </view>
                <view class="xt-list-item">
                  <view class="item-con" @click="toSearch">

                    <text style="color: #a1a1a1">{{
                      searchCondition.filterVal || "酒店名/品牌名/地标"
                    }}</text>
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
      </block>
      <block v-if="tabId == 'b2'">
        <mineComponent></mineComponent>
      </block>
    </view>

    
    <view class="flex-flex-page-bottom" v-if="user">
      <xt-tabbar
        :dataList="tabbarList"
        @clickTab="clickTab"
        width="1200px"
      ></xt-tabbar>
    </view>
    <loginControlComponent></loginControlComponent>
  </view>
</template>

<script>
import amap from "@/common/amap-wx.130";
import { DB } from "@/api/DB";
import { HotelServiceClient } from "@/services/HotelServiceClient";
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import mineComponent from "../mine/components/mineComponent.vue";
import loginControlComponent from "../components/loginControlComponent"
import {useStore} from 'vuex';
import {  computed, ref,getCurrentInstance ,watch } from 'vue';
export default {
  components: {loginControlComponent, mineComponent, UniIcons },
  setup(){
    let showTabBar =uni.getStorageSync("hm_token")?true:false;
    const store = useStore();
			const searchCondition = computed(()=>{
				return store.state.hotelClientStore.searchCondition; 
			});
			const searchDateRange = computed(()=>{
				return store.state.hotelClientStore.searchDateRange; 
			});
			// let conditionForm= ref({
			// 	filterVal:searchCondition.filterVal,
			// 	address:searchCondition.address,
			// 	location:searchCondition.location,
			// 	dateRange:searchDateRange.value

			// })
      // watch(conditionForm,(n,o)=>{
      //   console.error("改变",n)
      // },{deep:true})
    return {     
        showTabBar ,
        searchCondition,
        searchDateRange
      //  conditionForm  
    }
  },
  data() {
    return {
      isLoading: false,
      amapPlugin: null,
      tabbarList: [
        {
          id: "b1",
          label: "首页",
          icon: "/static/img/home-black.png",
          activeIcon: "/static/img/home-blue.png",
        },
        {
          id: "b2",
          label: "我的",
          icon: "/static/img/mine-black.png",
          activeIcon: "/static/img/mine-blue.png",
        },
      ],
      tabId: "b1",
      key: "a69cc73276ceb1a813f3be0d5d42c2aa", 
      location: [],
    };
  },
  computed: {
    config() {
      return this.$store.state.config;
    },
    user() {
      return this.$store.state.user;
    },
  },
  watch: {
    user(val, oldVal) {
      // if(val.phone!=oldVal.phone&&val.phone){
      //   //console.log("user改变",val,oldVal);
      //   this.getHotelList();
      // }
    },
    // filterVal(val) {
    //   this.searchAddress(val);
    // },
  },
  onLoad() {
   //#ifdef MP
   uni.hideHomeButton();
	//#endif
  },
  async created() {
    //console.log("client created", this.config);
    this.isLoading = true;
    this.amapPlugin = new amap.AMapWX({
      key: this.key,
    });
    await this.getLocation();
    this.isLoading = false;
   
    
  },
  async mounted() {
    //if(this.isPcShow){
    // #ifdef H5
    try {
      document.getElementsByTagName("uni-page-head")[0].style.display = "none";
    
    } catch (error) {}
    // #endif
  },
  onShow() {
    //console.log("client index onshow");
  },
  methods: {
    clickTab(id) {
      //console.log(id);
      this.tabId = id;
    },
    switchEvent() {
      uni.setStorageSync("userRole", "hotel");
      uni.reLaunch({
        url: "/pages/home/home",
      });
    },
    foramtDateLabel(dateTime) {
      let dyStr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      return {
        de: new Date(dateTime).Format("MM-dd"),
        dy: dyStr[new Date(dateTime).getDay()],
      };
    },
    dateConfim(e) {
      //console.log(e);
      this.$store.commit("hotelClientStore/updateSearchDateRange",e);
    },
    searchAddress(keywords) {
      this.amapPlugin.getInputtips({
        keywords: keywords,
        location: "",
        success: function (data) {
          //console.log("sssss", data);
          // if(data && data.tips){
          //   that.setData({
          //     tips: data.tips
          //   });
          // }
        },
      });
    },
    getLocation() {
      // #ifdef H5
          let obj={
							filterVal:"",
							address:"",
							location:[119.872549,30.55434]
				    }
            this.$store.commit("setLocation", [119.872549,30.55434]);
				    this.$store.commit("hotelClientStore/updateSearchCondition",obj);
            return true;
      // #endif
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: "gcj02",
          success: (res) => {
            //console.log("当前位置的经度：" + res.longitude);
            //console.log("当前位置的纬度：" + res.latitude);
            
            let obj={
							filterVal:"",
							address:"",
							location:[res.longitude, res.latitude]
				    }
            this.$store.commit("setLocation", [res.longitude, res.latitude]);
				    this.$store.commit("hotelClientStore/updateSearchCondition",obj);
            uni.hideLoading();
            resolve();
          },
        });
        // this.amapPlugin.getRegeo({
        //   //type: 'gcj02',
        //   success: (data) => {
        //     //console.log(data);
        //     this.address = data[0].name;
        //     this.location = [data[0].longitude, data[0].latitude];
        //     //console.log("当前坐标",this.location)
        //     this.$store.commit("setLocation",this.location);
        //     uni.hideLoading();
        //     resolve();
        //   },
        //   fail: (e) => {
        //     this.isLoading = false;
        //     //console.log(e);
        //     reject(e);
        //   },
        // });
      });
    },

    toSearch() {
      uni.navigateTo({
        url: "/pages_client/hotelSearch/hotelSearch",
        events: {
          getAddress: (obj) => {
            //console.log("ooooooooo", obj);
            // this.filterVal = obj.filterVal;
            // (this.address = obj.address), (this.location = obj.location);
           // this.getHotelList();
          },
        },
      });
    },
    async getHotelList() {
      //console.log("open", this.location);
      try {
        //await this.$store.dispatch("loginEvent", () => {
  
          let href = `/pages_client/client_hotelList/client_hotelList`;
          uni.navigateTo({
            url: href,
          });
        //});
      } catch (error) {}

      // if (this.isLoading) {
      //   //console.log("isloading....");
      //   return;
      // }
      // uni.showLoading();
      // try {
      //   const res = await this.$store.dispatch(
      //     "hotelClientStore/getHotelList",
      //     {
      //       location: [119.882659, 30.626099],
      //       maxDistance: 5000,
      //       filterVal: this.filterVal,
      //     }
      //   );
      //   //console.log(res);
      //   const condition={
      //     filterVal:this.filterVal,
      //     address: this.address,
      //     dateRange:this.dateRange,
      //     location:this.location,
      //   }
      //   uni.navigateTo({
      //     url: `/pages_client/client_hotelList/client_hotelList?condition=${encodeURIComponent(JSON.stringify(condition))}`,
      //   });
      //   uni.hideLoading();
      // } catch (error) {
      //   //console.log(error);
      //   uni.hideLoading();
      // }
    },
  },
  onShareAppMessage(res) {
    if (res.from != "button") {
      // 来自页面内分享按钮
      let url = `${this.config.cloudUrl}/HM/logo/yisu.png`;
      return {
        title: "议宿",
        imageUrl: url,
        path: `/pages/index/index`,
      };
    }
  },
};
</script>

<style lang="scss" scoped>
.switch {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 4px 8px;
  box-sizing: border-box;
  background: #000;
  border-radius: 20px;
  color: #fff;
  gap: 4px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 13px 1px #d9d9d9;
  }
}
.page-container {
  height: 100vh;
  background-color: #eee;
}
.submit-btn {
  background: #0765ae;
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
        font-weight: 400;
      }
      .normal {
        font-size: 13px;
        color: #a1a1a1;
      }
    }
  }
}
</style>

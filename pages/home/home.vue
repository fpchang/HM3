<template>
  <view class="home">
    <view class="top-container">
      <view class="scroll-content">
        <view class="logo-area" :style="{height: navTopHeight}">
          <view class="logo"> 
               <image  style="width: 188px; height: 94px; vertical-align: middle;transform:scale(0.8)"  src="https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/blue-logo.svg"></image>
		
          </view>
          <!-- <view><text>议宿管理系统</text></view> -->
        </view>
        <view :class="['top-area', isSticky? 'sticky-style':'']">
          <view class="title-area" :style="{opacity: opacityVal}">
            <view class="check-area" @click="showCheckHotel" v-if="hotel">
              <text class="$uni-font-size-lg h-n-style">{{
                hotel.hotelName
              }}</text>
              <view>
                <l-icon name="ic:sharp-expand-more" size="30px" color="#fff"></l-icon>
              </view>

            </view>
          </view>

        </view>
      </view>
    </view>
    <gatherComponent ref="gather">
    </gatherComponent>
    <uni-drawer ref="showLeft" mode="left" :width="drawerWidth">
      <view class="left-container">
        <view style="flex: 1; min-height: 330px">
          <view  class="black-area">
            <text>
                <l-icon name="line-md:confirm-square-filled" size="35px" color="#1E88E5" />
            </text>
           
          </view>
          <view class="title-area">
            <view class="title">
              <tiext>酒店列表</tiext>
            </view>
            <navigator url="/pages/hotelManage/hotelList/hotelList" hover-class="navigator-hover">
              <view class="btn"><text>管理</text></view>
            </navigator>
            

          </view>
          <scroll-view :style="{'height': scrollHeight}" scroll-x="false" scroll-y="true">

            <view>
              <view v-for="(item, index) of hotelList" style="padding:10px" @click="checkHotel(item._id)">
                <view style="display:flex;" :class="['zcard', item._id==hotel_id? 'zcard-active':'']"
                  @click="openHotel(item)">
                  <view class="select">
                    <l-icon v-if="item._id==hotel_id" name="line-md:circle-filled-to-confirm-circle-filled-transition"
                      size="35px" color="#fff" />
                    <l-icon v-if="item._id!=hotel_id" name="line-md:confirm-circle-twotone-to-circle-transition"
                      size="35px" color="#eee" />

                  </view>
                  <view style="width:80px;height:80px">

                    <image v-if="item.firstImages" style="width:100%;height:100%" mode="aspectFill"
                      :src="item.firstImages" />
                    <image v-if="!item.firstImages&&item._id!=hotel_id" style="width:100%;height:100%" mode="aspectFill"
                      :src="item.firstImages||'https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/app.png'" />
                    <image v-if="!item.firstImages&&item._id==hotel_id" style="width:100%;height:100%" mode="aspectFill"
                      :src="item.firstImages||'https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/blue-logo.jpg'" />

                  </view>
                  <view style="padding:15px 10px" class="zcard-right">
                    <view class="item"><view class="title">{{item.hotelName}}</view></view>
                    <view class="item"><view class="subtitle">{{item.hotelAddress}}</view></view>

                  </view>
                </view>
              </view>



            </view>

          </scroll-view>
          <!-- <view class="add-content-style">
			<view class="control-panal">
				<navigator url="/pages/hotelManage/hotelList/hotelList" hover-class="navigator-hover">
					<view class="control-item-group" @click="createOrderEvent">
						<view><l-icon name="ri:hotel-fill" size="25px" color="#288fff" /></view>
						<view><text style="color:#288fff">管理</text></view>
					</view>
				</navigator>
        <navigator url="/pages/hotelManage/createHotel/createHotel" hover-class="navigator-hover">
					<view class="control-item-group" @click="createOrderEvent">
						<view><l-icon name="solar:add-circle-bold" size="25px" color="#288fff" /></view>
						<view><text style="color:#288fff">添加</text></view>
					</view>
				</navigator>
			</view>
		</view> -->
        </view>
      </view>
    </uni-drawer>

    <uni-drawer ref="showRight" mode="right" :width="475">
      <view class="right-container">
        <view style="box-sizing: border-box">
          <!-- <view style="height:70px" v-if="!isPc"></view> -->
          <mine></mine>
        </view>
      </view>
    </uni-drawer>
    <uni-popup ref="popupHotelCreate" background-color="transprant">
      <view class="popup-content">
        <view class="create-order-title-style">创建酒店</view>
        <view class="comContent">
          <createHotelComponent @closePopup="closePopup"></createHotelComponent>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="popupFeedback" background-color="transprant">
      <view class="popup-content">
        <view class="create-order-title-style">意见与反馈</view>
        <view class="comContent">
          <feedback></feedback>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="popupRecharge" background-color="transprant">
      <view class="popup-content">
        <view class="create-order-title-style">充值中心</view>
        <view class="comContent">
          <recharge></recharge>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="popupInstructions" background-color="transprant">
      <view class="popup-content">
        <view class="create-order-title-style">使用说明</view>
        <view class="comContent">
          <intructions></intructions>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import gatherComponent from "@/pages/gather/components/gatherComponent";
import orderComponent from "@/pages/order/components/orderComponent";
import createHotelComponent from "@/pages/hotelManage/components/createHotelComponent";
import roomTypeListComponent from "@/pages/hotelManage/components/roomTypeListComponent.vue";
import employeeComponent from "@/pages/hotelManage/components/employeeComponent.vue";
import menuListComponent from "@/pages/catering/components/menuListComponent.vue";
import scenicSpotListComponent from "@/pages/scenicSpot/components/scenicSpotListComponent";
import fm from "@/pages/financialManagement/components/fmIndexComponent";
import mine from "@/pages/mine/mine";
import feedback from "@/pages/mine/feedback/feedback";
import recharge from "@/pages/mine/recharge/rechargeComponent";
import intructions from "@/pages/mine/instructions/instructions";
import { AccountService } from "@/services/AccountService";
import {useStore} from 'vuex';
export default {
  components: {
    gatherComponent,
    orderComponent,
    createHotelComponent,
    roomTypeListComponent,
    employeeComponent,
    menuListComponent,
    scenicSpotListComponent,
    mine,
    fm,
    feedback,
    recharge,
    intructions,
  },
  setup(){
   
	const store = useStore()
	let config = store.state.config;
	let imgUrl=`${config.cloudUrl}/HM/images/miniprogram/`;
  return {
    config
  }
  },
  data() {
    return {
      isLoading:false,
      title: "Hello",
      isSticky: false,
      opacityVal: 1,
      currentTab_index: 0,
      showDrawer: false,
      clickTime: 0,
      tabList: [],
      slelectHotelvalue: "",
      activeHotle: {
        _id: "002",
        name: "见山舍",
        name_Zn: "",
        subName: "1店",
        logoSrc:
          "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
      },
      //hotelList: []
    };
  },
  onLoad(e) {
	  //#ifdef MP
    uni.hideHomeButton();
	//#endif
  },
  async created() {
    uni.$on("showPopupPivot", (popup, eventType) => {
      //popup开发枢纽，0 关闭，1打开
     
      if (eventType == 1) {
        this.$refs[popup].open();
        return;
      }
      this.$refs[popup].close();
    });
 
    await this.$store.dispatch("loginEvent");
    //this.initData();
    
  },
  onShow() {
    console.log("index onshow");
    if (this.$store.state.isPcShow ||!this.$store.state.user) {
     // uni.hideTabBar();
    }
    //if(this.isPcShow){
    // #ifdef H5
    try {
      
     // document.getElementsByTagName("uni-page-head")[0].style.display = "none";
    } catch (error) {}

    // #endif

    //	}
  },
  onShareAppMessage(res) {
    if (res.from != "button") {
      // 来自页面内分享按钮
      return {
        title: "议宿",
        imageUrl: `${this.$store.state.config.cloudUrl}/HM/images/hotel.jpg`,
        path: `/pages/index/index`,
      };
    }

    if (this.currentTab_index == 2) {
      //景区分享
      // return {
      //   title: `景点价格【${this.hotel.hotelName}】`,
      //   imageUrl: `${this.$store.state.config.cloudUrl}/HM/images/sc.jpg`,
      //   path: `/pages/scenicSpot/showScenicSpot/showScenicSpot?hotel_id=${this.hotel_id}`,
      // };
      return {
			title: "议宿",
			imageUrl: `${this.$store.state.config.cloudUrl}/HM/images/sc.jpg`,
			path: `/pages_client/hotelHome/hotelHome?hotel_id=${this.hotel._id}&&tabId=b4`,
		};
    }
    if (this.currentTab_index == 3) {
      //点菜分享
      return {
        title: `【${this.hotel.hotelName}】订餐`,
        imageUrl: `${this.$store.state.config.cloudUrl}/HM/images/food.jpg`,
        path: `/pages/catering/orderDishes/orderDishes?hotel=${encodeURIComponent(JSON.stringify(this.hotel))}`,
      };
    }
  },
  beforeMounted() {
    if (this.isPcShow) {
      //uni.hideTabBar();
    }
    console.log("before mounted....>>>");
  },
  mounted() {
    console.log("index mounted....>>>", this.$store);
  },
  async onPullDownRefresh() {
    console.log("index veu refrush");
    //await this.$store.dispatch("loginEvent");
   // await this.initData();
    await this.$refs.gather.initData();
    uni.stopPullDownRefresh();
  },
  computed: {
    isPcShow() {
      console.log("index computed isPcshow....>>>");
      return this.$store.state.isPcShow;
    },
    isPc() {
      try {
        return (
          uni.getSystemInfoSync().deviceType == "pc" ||
          uni.getDeviceInfo().deviceType == "pc"
        );
      } catch (e) {
        return false;
      }
    },
    drawerWidth(){
      return 340;
    },
    isBrowser() {},

    hotel_id() {
      return this.$store.state.hotel_id;
    },
    user() {
      return this.$store.state.user;
    },
    hotelList() {
      return this.$store.state.hotelList;
    },
    noData() {
      return !this.hotelList || this.hotelList.length < 1;
    },
    hotel() {
        let h= this.hotelList.find((item) => item._id == this.hotel_id);
        return h;
      
    },
    permissionList() {
      return this.$store.state.permissionStore.permissionList;
    },
    dataHasRead() {
      return this.hotelList && this.hotelList.length && this.hotel_id;
    },
    hotelListFormat() {
      return this.hotelList.map((item) => {
        return {
          text: item.hotelName,
          value: item._id,
        };
      });
    },
    navTopHeight() {
      // #ifdef MP-WEIXIN
      //return "70px"
      // #endif

      //return this.isPcShow? "0px" : "70px";
      return "110px";
    },

    disHeightVal() {
      return "20px";
    },
    scrollHeight() {
      return `calc(100vh - ${this.disHeightVal} - ${this.navTopHeight} )`;
    },
  },
  watch: {
    async hotel_id(val,oldVal) {
      console.log("index watch hotel_id", val);
  
	  if(val!=oldVal){
		 // await this.$store.dispatch("getPermissionList", val);

	  }
    
    },
 
    permissionList() {
    // this.initTabMenu();
    },
    user(val,oldVal){
        //this.initData();
     
     
    }
  
  },
  methods: {
    switchEvent() {
      uni.setStorageSync("userRole", "user");
      uni.reLaunch({
        url: "/pages_client/client_index/client_index",
      });
    },
    async vaildToken(callback) {
      try {
        if (!uni.getStorageSync("hm_token")) {
          console.log("没有hm_token");
          this.$store.dispatch("loginOut");
          return;
        }
        const res = await AccountService.validToken();
        if (res.result.code) {
          res.result.msg &&
            uni.showToast({
              title: res.result.msg,
              duration: 2000,
              icon: "error",
            });
          this.$store.dispatch("loginOut");
          return;
        }
        console.log("token验证通过");
        callback && callback();
      } catch (error) {}
    },
  
    showCheckHotel() {
      this.showDrawerEvent();
    },
    checkHotel(hotel_id) {
      console.warn(hotel_id);
      if (hotel_id == this.hotel_id) {
        return;
      }
      this.$store.commit("checkHotel", hotel_id);
      this.$refs.showLeft.close();
    },
    showDrawerEvent() {
      this.showDrawer = true;
      this.$refs.showLeft.open();
    },
    //pc端右侧面板
    openRightPanal() {
      uni.$once("closeRightDrawer", () => {
        this.$refs.showRight.close();
      });
      this.$refs.showRight.open();
    },
    closeDrawerEvent() {
      this.showDrawer = false;
      this.$refs.showLeft.close();
    },
    scrollRefrush(){
      this.isLoading=true;
      setTimeout(() => {
        this.isLoading=false;
      }, 1000);
      this.clickTab({index:this.currentTab_index});
   
      
    },
    clickTab(e) {
      console.log("clickTab",e)
      if (this.currentTab_index == e.index) {
        //只触发刷新
        if (this.$store.state.partialRefreshComName) {
          console.log("正在执行刷新中，，，");
          return;
        }
        uni.showLoading();
        
        this.$store.commit(
          "setPartialRefreshComName",
          this.tabList[e.index].ComponentName
        );
      
        return;
      }
      this.currentTab_index = e.index;
    },
    scrollEvent(e) {
      let { scrollTop } = e.detail;
      //	this.opacityVal = 1 - (Math.min(scrollTop / 60, 1));
      //	this.isSticky = (scrollTop >= 60 ? true : false);   
    },
    swiperContentEvent(e) {
      this.currentTab_index = e.detail.current;
    },
    hotelManage() {
      uni.navigateTo({
        url: "/pages/hotelManage/hotelList/hotelList",
      });
    },
    addNewHotel() {
      //if (!this.isPcShow) {
        uni.navigateTo({
          url: "/pages/hotelManage/createHotel/createHotel",
        });
        return;
     // }
     // this.$refs.popupHotelCreate.open();
    },
    closePopup() {
      try {
       // this.$refs.popupHotelCreate.close();
        //  this.$refs.orderChildTableListRef.getOrderListByCondition();
        //  this.$refs.orderChildCalendarList.getOrderList();
        // this.$refs.orderChildListRef.getOrderList();
      } catch (e) {
        //TODO handle the exception
      }
    }
  }
}
</script>

<style lang="scss">
.home {
  height: 100vh;
  background: #fff;
}

.zcard {
  cursor: pointer;
  &:hover {
    /*transform: scale(1.01);*/
    box-shadow: 2px 4px 12px #000;

  }

  background-color: #fffffe;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .select {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
  }

  .zcard-right {
    flex: 1;
    color: #fff;
    font-size: $uni-font-size-sm ;
    display: flex;
    min-width: 0;
    flex-direction: column;
    .item{
        min-width: 0;
    }
    .title {

      color: #333333;
      font-weight: bold;
      font-size: $uni-font-size-base ;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap

    }

    .subtitle {
      color: #666666;
       text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap
    }

    .item {
      padding: 3px 0;

      .tabscontainer {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
    }

    .bottom {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
    }
  }
}

.zcard-active {
  background-color: #0765ae;

  .zcard-right {
    color: #fff;

    .title {
      color: #fff;
    }

    .subtitle {
      color: #eee;
    }
  }
}

.right-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

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
}

.top-container {
  display: flex;
  flex-direction: column;
  font-size: $uni-font-size-lgs;
   background-image: linear-gradient(162deg, #0765ae, #0765ae, #0765ae7a);
}

.more-menu-area {
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.add-icon-style {
  cursor: pointer;
}

.add-icon-style:hover {
  color: #ff0000;
}

.swiper-container-scroll {
  display: flex;
  flex-direction: column;
}

.scroll-content .logo-area{
  display: flex;
  align-items: end;
  color: #fff;
  .logo{
        transform: translateX(-31px);
  }
}

.scroll-content .top-area {
  height: 90px;
  box-sizing: border-box;
  z-index: 999;


  .title-area {
    position: relative;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;

    .check-area {
      cursor: pointer;
      max-width: calc(100vw - 40px);

      height: 24px;
      display: flex;
      flex-direction: row;
      text-align: center;

      .h-n-style {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #fff;

      }

      .check-panal {
        width: 120px;
        max-width: 200px;
        padding: 10px 0;
        position: absolute;
        top: 50px;
        left: 20px;
        background-color: #ddd;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 20px;
        z-index: 999;
        font-size: $uni-font-size-lg;
      }
    }
  }

  .navbar {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #fff;

    .nav-content {
      padding: 0 15px;
      width: 100%;
      box-sizing: border-box;
    }
  }
}

.sticky-style {
  width: 100vw;
  position: fixed;
  top: 0px;
  left: 0;
}

.activeHotelItemSelect {
  background-color: #ddd !important;
  /*border:2rpx solid blue;*/
}

.left-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f5f9;
.black-area{
  height: 80px;
   padding: 0 15px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}
  .title-area {

    display: flex;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;

    .title {
      font-size: 16px;
      font-weight: bold;
      height: 30px;

      line-height: 30px;
      color: #000101;
    }

    .btn {
      font-size: 12px;
      background-color: #1E88E5;
      color: #fff;
      padding:2px 10px;
      border-radius: 6px;
    }
  }

}

.right-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.list-panal {
  .list-panal-item {
    display: flex;
    padding: 0 12px;
    height: 40px;
    box-sizing: border-box;
    align-items: center;
    font-size: 13px;

    .i-area {
      border-bottom: 1px solid #eaeaea;
      box-sizing: border-box;
      display: flex;
      flex: 1;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      padding-left: 8px;
    }
  }
}

.card-panal {
  padding: 10px;
  box-sizing: border-box;

  .card {
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    background: #fff;
  }
}


</style>

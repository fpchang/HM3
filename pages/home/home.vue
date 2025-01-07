<template>
  <view>
    <block v-if="noData">
      <noData
        text_content="您还没有酒店"
        :showControl="true"
        text_control_add="创建一个"
        @Event_one="addNewHotel"
      ></noData>
    </block>
    <block v-if="!noData">
      <view class="top-container">
        <view class="scroll-content">
          <!-- <view :style="{height:navTopHeight}"></view> -->
          <view :class="['top-area', isSticky ? 'sticky-style' : '']">
            <view class="title-area" :style="{ opacity: opacityVal }">
              <view class="check-area" @click="showCheckHotel">
                <text class="$uni-font-size-lg h-n-style">{{
                  hotel.hotelName
                }}</text>
                <uv-icon
                  v-if="hotel.hotelName"
                  name="arrow-down-fill"
                  color="#606266"
                  size="14px"
                  top="2"
                ></uv-icon>
              </view>
              <view class="right-area">
                <view class="switch" @click="switchEvent">
                  <image
                    v-if="config.cloudUrl"
                    :src="`${config['cloudUrl']}/HM/images/miniprogram/line_switch_white.png`"
                    style="width: 20px; height: 20px"
                  ></image
                  ><text>切换客户端</text>
                </view>
                <view
                  class="more-menu-area"
                  style="cursor: pointer"
                  v-if="isPcShow"
                >
                  <uni-icons
                    type="bars"
                    size="30"
                    @click="openRightPanal"
                  ></uni-icons>
                </view>
              </view>
            </view>
            <view class="navbar">
              <view class="nav-content">
                <uv-tabs
                  @click="clickTab"
                  :list="tabList"
                  lineWidth="0"
                  lineColor="#f56c6c"
                  :current="currentTab_index"
                  :activeStyle="{
                    color: '#303133',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    transform: 'scale(1.15)',
                  }"
                  :inactiveStyle="{
                    color: '#606266',
                    fontSize: '18px',
                    transform: 'scale(1)',
                  }"
                  itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
                >
                </uv-tabs>
              </view>
            </view>
          </view>
        </view>
      </view>
      <swiper
        :style="{ height: scrollHeight }"
        :current="currentTab_index"
        @change="swiperContentEvent"
      >
        <swiper-item v-for="item in tabList">
          <scroll-view
            class="swiper-container-scroll"
            :scroll-y="true"
            :scroll-x="false"
            show-scrollbar="false"
            :scroll-top="0"
            :style="{ height: scrollHeight }"
          >
            <view v-if="dataHasRead">
              <gatherComponent
                :key="item.time"
                :createTime="item.time"
                :disHeightVal="disHeightVal"
                v-if="item.ComponentName == 'gatherComponent'"
              >
              </gatherComponent>
              <orderComponent
                :key="item.time"
                :createTime="item.time"
                :disHeightVal="disHeightVal"
                v-if="item.ComponentName == 'orderComponent'"
              >
              </orderComponent>
              <roomTypeListComponent
                :key="item.time"
                :createTime="item.time"
                v-if="item.ComponentName == 'roomTypeListComponent'"
              >
              </roomTypeListComponent>
              <employeeComponent
                :key="item.time"
                :createTime="item.time"
                v-if="item.ComponentName == 'employeeComponent'"
              ></employeeComponent>

              <menuListComponent
                :key="item.time"
                :createTime="item.time"
                v-if="item.ComponentName == 'menuListComponent'"
              ></menuListComponent>
              <scenicSpotListComponent
                :key="item.time"
                :createTime="item.time"
                v-if="item.ComponentName == 'scenicSpotListComponent'"
              ></scenicSpotListComponent>

              <hotelList
                :key="item.time"
                :createTime="item.time"
                v-if="item.ComponentName == 'hotelList'"
              >
              </hotelList>
              <fm
                :key="item.time"
                :createTime="item.time"
                v-if="item.ComponentName == 'fm'"
              >
            </fm>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </block>
    <uni-drawer ref="showLeft" mode="left" :width="320">
      <view class="left-container">
        <view style="flex: 1; min-height: 330px">
          <!-- <view style="height:70px" v-if="!isPc"></view> -->
          <uni-section title="酒店列表" type="line"></uni-section>
          <view class="card-panal">
            <view class="card">
              <view class="list-panal">
                <view
                  class="list-panal-item"
                  v-for="item of hotelList"
                  @click="checkHotel(item._id)"
                >
                  <uni-icons
                    :type="item._id == hotel_id ? 'checkbox' : 'circle'"
                    size="22"
                    color="#06c"
                  ></uni-icons>
                  <view class="i-area">
                    <text>{{ item.hotelName }}</text>
                    <uni-icons
                      type="forward"
                      size="22"
                      color="#3333335c"
                    ></uni-icons>
                  </view>
                </view>
              </view>
            </view>
          </view>
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
import hotelList from "@/pages/hotelManage/hotelList/hotelList";
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
    hotelList,
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
    console.log("home onload");
    uni.hideHomeButton();
  },
  async created() {
    console.log("index create....>>>", uni.getSystemInfoSync());
    uni.$on("showPopupPivot", (popup, eventType) => {
      //popup开发枢纽，0 关闭，1打开
      console.log("开关枢纽", arguments);
      if (eventType == 1) {
        this.$refs[popup].open();
        return;
      }
      this.$refs[popup].close();
    });
    await this.$store.dispatch("loginEvent");
    this.initData();
  },
  onShow() {
    console.log("index onshow");
    if (this.$store.state.isPcShow) {
      uni.hideTabBar();
    }
    //if(this.isPcShow){
    // #ifdef H5
    try {
      
      document.getElementsByTagName("uni-page-head")[0].style.display = "none";
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
      uni.hideTabBar();
    }
    console.log("before mounted....>>>");
  },
  mounted() {
    console.log("index mounted....>>>", this.$store);
  },
  async onPullDownRefresh() {
    console.log("index veu refrush");
    await this.$store.dispatch("loginEvent");
    await this.initData();
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
      return this.hotelList && this.hotelList.length < 1;
    },
    hotel() {
      try {
        return this.hotelList.find((item) => item._id == this.hotel_id);
      } catch (error) {
        return {};
      }
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
      return "0px";
    },

    disHeightVal() {
      return "90px";
    },
    scrollHeight() {
      return `calc(100vh - ${this.disHeightVal} - ${this.navTopHeight} )`;
    },
  },
  watch: {
    async hotel_id(val,oldVal) {
      console.log("index watch hotel_id", val);
	  if(val!=oldVal){
		await this.$store.dispatch("getPermissionList", val);
	  }
    
    },
    hotelList(narr, oarr) {
      //this.setDefaultHotel()
    },
    permissionList() {
      this.initTabMenu();
    },
    user(val,oldVal){
      
      if(val.phone!=oldVal.phone&&val.phone){
		console.log("user改变",val,oldVal);
        this.initData();
      }
     
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
    async initData() {
      console.log("init Data for home page");
      try {
        this.$store.commit("setUser", uni.getStorageSync("user"));
        await this.$store.dispatch("getHotelList");
        this.$store.commit("setBaseDatahasLoad", true);
        this.initTabMenu();
        uni.hideLoading();
      } catch (error) {
        console.log("initData .....error,", error);
        uni.hideLoading();
      }
    },
    initTabMenu() {
      if (this.permissionList.length < 1) {
        return;
      }
      let arr = [
        {
          //index: 0,
          name: "关注",
          time: 0,
          permission: "MENU_GATHER",
          ComponentName: "gatherComponent",
        },
        {
          //index: 1,
          name: "订房管理",
          time: 0,
          permission: "MENU_ORDER",
          ComponentName: "orderComponent",
        },
        {
          //index: 2,
          name: "合作景点",
          time: 0,
          permission: "MENU_SCENICSPOT",
          ComponentName: "scenicSpotListComponent",
        },
        {
          //index: 3,
          name: "订餐",
          time: 0,
          permission: "MENU_CATERING",
          ComponentName: "menuListComponent",
        },

        {
          //index: 4,
          name: "房型管理",
          time: 0,
          permission: "MENU_ROOMTYPE",
          ComponentName: "roomTypeListComponent",
        },
        {
          //index: 5,
          name: "人员管理",
          time: 0,
          permission: "MENU_EMPLOYEE",
          ComponentName: "employeeComponent",
        },
        {
          //index: 7,
          name: "酒店管理",
          time: 0,
          permission: "MENU_HOTELMANAGE",
          ComponentName: "hotelList",
        }, {
          //index: 8,
          name: "财务管理",
          time: 0,
          permission: "MENU_FM",
          ComponentName: "fm",
        }
      ];
      this.tabList = arr.filter((item) => {
        return this.permissionList.includes(item.permission);
      });
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
    clickTab(e) {
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
      if (!this.isPcShow) {
        uni.navigateTo({
          url: "/pages/hotelManage/createHotel/createHotel",
        });
        return;
      }
      this.$refs.popupHotelCreate.open();
    },
    closePopup() {
      try {
        this.$refs.popupHotelCreate.close();
        //  this.$refs.orderChildTableListRef.getOrderListByCondition();
        //  this.$refs.orderChildCalendarList.getOrderList();
        // this.$refs.orderChildListRef.getOrderList();
      } catch (e) {
        //TODO handle the exception
      }
    },
  },
};
</script>

<style lang="scss">
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
.scroll-content {
}

.scroll-content .top-area {
  height: 90px;
  box-sizing: border-box;
  z-index: 999;
  background-color: #fff;

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
      max-width: 200px;

      height: 24px;
      display: flex;
      flex-direction: row;
      text-align: center;

      .h-n-style {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #606266;
        padding-right: 14px;
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

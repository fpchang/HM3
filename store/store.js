// 页面路径：store/index.js
import { createStore } from "vuex";
import { DB } from "../api/DB";
import menuStore from "./modules/menuStore";
import orderStore from "./modules/orderStore";
import permissionStore from "./modules/permissionStore";
import scenicSpotStore from "./modules/scenicSpotStore";
import hotelClientStore from "./modules/hotelClientStore";
import { HotelService } from "../services/HotelService";
import { AccountService } from "../services/AccountService";
const store = createStore({
  modules: {
    menuStore,
    orderStore,
    permissionStore,
    scenicSpotStore,
    hotelClientStore,
  },
  state: {
    //存放状态
    config: null, //配置信息
    viewWidth: null, //可视宽度
    partialRefreshComName: "", //局部刷新组件值
    shareObj: {},
    baseDatahasLoad: false, //基本数据准备完毕
    topHeight: 90,
    tabHeight: 44,
    isPcShow: false,
    user: "",
    hotelList: null,
    employeeList: [],
    hotel_id: "",
    roomType: [],
    location: [],
  },

  mutations: {
    //当前位置坐标
    setLocation(state, loc) {
      this.location = loc;
    },
    setPartialRefreshComName(state, comName) {
      state.partialRefreshComName = comName;
    },
    setViewWidth(state, w) {
      state.viewWidth = w;
    },
    setConfig(state, obj) {
      console.log("加载配置。。。。。");
      state.config = obj;
    },
    setShareObj(state, obj) {
      state.shareObj = obj;
    },
    setBaseDatahasLoad(state, flag) {
      state.baseDatahasLoad = flag;
    },
    setPcShow(state, flag) {
      state.isPcShow = flag;
    },
    setUser(state, user) {
      state.user = user;
    },
    setHotelId(state, hotel_id) {
      state.hotel_id = hotel_id;
    },
    checkHotel(state, hotel_id) {
      console.log("checkhotel>>>>>");
      uni.setStorageSync("hotel_id", hotel_id);
      store.commit("setHotelId", hotel_id);
    },
    //调用 this.$store.commit('updateHotelList',[])
    updateHotelList(state, list) {
      state.hotelList = list;
      store.commit("setDefaultHotel");
    },
    updateEmployeeList(state, list) {
      state.employeeList = list;
    },
    updateRoomType(state, list) {
      state.roomType = list;
    },

    updateScenicSpot(state, list) {
      state.scenicSpotList = list;
    },

    setDefaultHotel(state) {
      console.log("setDefaultHotle");
      if (!state.hotelList.length) {
        return;
      }
      let _hotel_id = uni.getStorageSync("hotel_id");

      let h = state.hotelList.find((item) => {
        return item._id == _hotel_id;
      });
      let n_hotel_id = h ? _hotel_id : state.hotelList[0]._id;
      if (n_hotel_id == state.hotel_id) {
        console.warn("与旧hotel_id相同，无需重置");
        return;
      }
      store.commit("checkHotel", n_hotel_id);
      store.dispatch("getRoomType");
    },
    updateUser(state) {
      const user = uni.getStorageSync("user");
      if (user) {
        store.commit("setUser", user);
      }
    },
  },
  actions: {
    initViewWidth(context) {
      const sys = uni.getSystemInfoSync();
      let isPc = sys["deviceType"] == "pc";
      let w = sys["windowWidth"];
      // #ifdef MP-WEIXIN ||APP-PLUS
      w = uni.getWindowInfo().windowWidth;
      isPc = uni.getDeviceInfo()["deviceType"] == "pc";
      // #endif
      let scrollWidth = isPc ? 20 : 0;
      let val = w - scrollWidth;
      context.commit("setViewWidth", val);
    },
    async getUser(context) {
      const res = await AccountService.getuserByToken();
      if (res.result.data[0]) {
        uni.setStorageSync("user", res.result.data[0]);
        context.commit("setUser", res.result.data[0]);
      }
      return res;
    },
    async getHotelList(context) {
      console.log("服务端hotellist");
      const res = await HotelService.getHotelList();
      console.log("酒店列表", res);
      context.commit("updateHotelList", res.result);
      return res;
    },
    async getRoomType(context) {
      const res = await HotelService.getRoomType(context.state.hotel_id);
      console.log("房型列表", res);
      //let obj = res.result.data.length?res.result.data:[];
      context.commit("updateRoomType", res.result.data);
      return res;
    },
    errorEvent(context, error) {
      try {
        const { code, msg } = error;
        if (code == 9999) {
          context.dispatch("loginOut");
        }
      } catch (error) {}
    },
     loginEvent(context) {
		return new Promise(async (resolve,reject)=>{
			if (!uni.getStorageSync("hm_token")) {
				//未登录
				console.log("未登录");
				context.dispatch("clearCache");
				uni.navigateTo({ url: "/pages/login/login" });
				reject();
				return;
			  }
			const res = await AccountService.validToken();
			if (res.result.code) {
				res.result.msg && uni.showToast({
					title: res.result.msg,
					duration: 2000,
					icon: "error",
				});
				context.dispatch("clearCache");
				uni.navigateTo({ url: "/pages/login/login" });
				reject();
				return;
			}
			resolve();
		})
      
	 
    },
	async vaildToken(context) {		
			const res = await AccountService.validToken();
			if (res.result.code) {
				res.result.msg && uni.showToast({
					title: res.result.msg,
					duration: 2000,
					icon: "error",
				});
				//this.$store.dispatch("loginOut");
				return Promise.reject;
			}
			console.log("token验证通过")
			return Promise.resolve;
			
			
		
	},
	clearCache(context){
		uni.clearStorageSync();
      	context.commit("setUser", {});
      	context.commit("setHotelId", "");
	},
    loginOut(context) {
      console.log("退出登录");
      context.dispatch("clearCache")
      uni.reLaunch({
        url: "/pages/login/login",
      });
    },
  },
  getters: {
    hotelObj: (state) => {
      return state.hotelList.find((item) => item._id == state.hotel_id);
    },
  },
});
export default store;

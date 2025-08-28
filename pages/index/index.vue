<template>
  <view class="index">
    <block v-if="noData">
      <noData
        text_content="您还没有酒店"
        :showControl="true"
        :showLoginOut="true"
        text_control_add="创建一个"
        @Event_one="addNewHotel"
      ></noData>
    </block>
    <!-- 	<view class="container" v-if="!isLoading">
			<view class="item">
				<view class="card" @click="selectRole('user')">
					<view class="i"><uni-icons type="person-filled" size="100"></uni-icons></view>
					<view class="h">我是用户</view>
					<view><uni-icons type="forward" size="80" color="#a1a1a1"></uni-icons></view>
				</view>
			</view>
			<view class="item">
				<view class="card" @click="selectRole('hotel')">
					<view class="i"><uni-icons type="shop-filled" size="100"></uni-icons></view>
					<view class="h">我是商家</view>
					<view><uni-icons type="forward" size="80" color="#a1a1a1"></uni-icons></view>
				</view>
			</view>
		</view> -->
  </view>
</template>

<script>
import { AccountService } from "../../services/AccountService";
import UniIcons from "../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import $store from '@/store/store';

export default {
  components: {
    UniIcons,
  },

  data() {
    return {
      isLoading: true,
      userRole: null,
    };
  },
  async onLoad(e) {
    // const { proxy } = getCurrentInstance();
    // await proxy.$onLaunched;
    // uni.navigateTo({
    // 	url:"/pages/tt/tt"
    // })
    // return;
    // let userRole =uni.getStorageSync("userRole");
    // if(!userRole){
    // 	this.isLoading=false;
    // 	return;
    // }
    // if(userRole=="hotel"){
    // 	uni.switchTab({url:"/pages/home/home"});
    // }else{
    // 	uni.redirectTo({
    // 	url:"/pages_client/client_index/client_index",
    // });
    //}
  },
  async created() {

    await this.$store.dispatch("loginEvent");
    this.initData();
  },
  onShow() {},
  onShareAppMessage(res) {},
  beforeMounted() {
    if (this.$store.state.isPcShow) {
      uni.hideTabBar();
    }
    console.log("before mounted....>>>");
  },
  async mounted() {
    console.log("index mounted....>>>", this.$store);
    await this.setConfig();
    // uni.switchTab({
    // 	url: "/pages/home/home"
    // });
  },
  onPullDownRefresh() {},
  computed: {
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
      return !this.isLoading&&( !this.hotelList || this.hotelList.length < 1);
    },
  },
  watch: {
    hotelList(narr = [], oarr = []) {
      let n = narr || [];
      let o = oarr || [];

      if (o.length < 1 && n.length > 0) {
        uni.switchTab({
          url: "/pages/home/home",
        });
      }
    },
  },
  methods: {
    async initData() {
      try {
        await this.$store.dispatch("getHotelList");
        this.$store.commit("setBaseDatahasLoad", true);
        this.isLoading=false;
        if (!this.hotelList || this.hotelList.length < 1) {
          uni.hideLoading();

          return;
        }
        uni.switchTab({
          url: "/pages/home/home",
        });
        uni.hideLoading();
      } catch (error) {
        console.log("initData .....error,", error);
        uni.hideLoading();
      }
    },
    addNewHotel() {
      uni.navigateTo({
        url: "/pages/hotelManage/createHotel/createHotel",
      });
      return;
    },
    selectRole(role) {
      switch (role) {
        case "user":
          uni.setStorageSync("userRole", "user");
          uni.reLaunch({
            url: "/pages_client/client_index/client_index",
          });
          break;
        case "hotel":
          uni.setStorageSync("userRole", "hotel");
          uni.reLaunch({
            url: "/pages/home/home",
          });
          break;

        case "travelAgency":
          uni.setStorageSync("userRole", "travelAgency");
          break;
      }
    },
    async setConfig() {
      try {
        const res = await AccountService.getConfig();
        console.log("参数config", res);
        this.$store.commit("setConfig", res.result);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.index {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 450px;
  flex: 1;

  .item {
    padding: 20px;
    box-sizing: border-box;

    .card {
      cursor: pointer;
      display: flex;
      align-items: center;
      border-radius: 12px;
      transition: transform 0.3s ease;
      background: #eee;

      &:hover {
        transform: scale(1.1);
        background: #ddd;
        color: #313131;
      }

      .i {
        padding: 20px;
      }

      .h {
        flex: 1;
        color: #a1a1a1;
        font-size: 20px;
      }
    }
  }
}
</style>

<template>
  <view class="indexAdvise" v-if="isReading">
    <scroll-view
      :scroll-x="false"
      :scroll-y="true"
      style="height: 100vh"
      @refresherrefresh="refrush"
      :refresher-enabled="false"
      refresher-default-style="white"
      :refresher-triggered="refresher_triggered"
    >
		<view :style="{ height: navTopHeight }"></view>

			
	
         
      <view class="introduce">
		  <view class="card glass" style="padding:0">
			  <view class="video-content"> 
			  <xt-video bgColor="rgba(0, 0, 0, 0.6)" videoUrl="https://cdn.hotelsys.fun/HM/images/advise/indexadvise.mp4"></xt-video>             
			  </view>
		      		
		   </view>
        <view class="card glass">
          <view class="title">简介</view>
          <view class="txt-content">
            议宿是一款基于酒店民宿日常事务管理开发的工具类软件，提供基础的房型房间管理，收入与支出的财务管理，财务统计图表。订单与房态管理，并自动生成店铺个性化信息展示，并且能分享给其它用户，方便快速预览。酒店管理员随身管理类必备工具。
          </view>
        </view>
        <view class="card glass">
          <view class="title">功能</view>
          <view class="content">
            <view class="control-item-group">
              <view
                ><l-icon name="solar:reorder-bold" size="80px" color="#4f99fd"
              /></view>
              <view><text style="color: #fff">订单管理</text></view>
            </view>
            <view class="control-item-group">
              <view
                ><l-icon
                  name="solar:calendar-date-bold-duotone"
                  size="80px"
                  color="#34ce84"
              /></view>
              <view><text style="color: #fff">房态管理</text></view>
            </view>
            <view class="control-item-group">
              <view
                ><l-icon
                  name="ic:sharp-maps-home-work"
                  size="80px"
                  color="#905d3e"
              /></view>
              <view><text style="color: #fff">房型管理</text></view>
            </view>
            <view class="control-item-group">
              <view
                ><l-icon
                  name="material-symbols:bar-chart-4-bars"
                  size="80px"
                  color="orange"
              /></view>
              <view><text style="color: #fff">财务管理</text></view>
            </view>
            <view class="control-item-group">
              <view
                ><l-icon
                  name="icon-park-solid:people-plus-one"
                  size="80px"
                  color="green"
              /></view>
              <view><text style="color: #fff">员工账号</text></view>
            </view>
            <view class="control-item-group">
              <view
                ><l-icon name="majesticons:monitor" size="80px" color="#fff"
              /></view>
              <view><text style="color: #fff">店铺信息展示</text></view>
            </view>
            <view class="cs"></view>
            <view class="cs"></view>
            <view class="cs"></view>
            <view class="cs"></view>
          </view>
        </view>
      </view>
      <view style="height: 120px"></view>
      <view class="control">
        <!-- #ifdef MP-->
        <!-- <button
          class="btn glass"
          open-type="getPhoneNumber"
          @getphonenumber="decryptPhoneNumber"
        >
          登录体验
        </button> -->

        <!-- #endif-->
        <!-- #ifndef MP-->

        <!-- #endif-->
        <button class="btn glass" @click="toLoginEvent()">登录体验</button>
      </view>
    </scroll-view>
    <uni-popup
      ref="popup_confirm"
      type="bottom"
      :safe-area="false"
      border-radius="10px 10px 0 0"
    >
      <view class="popup-con">
        <view class="tit">议宿申请</view>
        <view class="txt-content"
          >此系统需要使用手机号登录后才能使用全部功能，确认是否手机号登录</view
        >
        <view class="control">
          <view class="btn-style" @click="agreeGetPhoneEvent(false)">拒绝</view>
          <view class="btn-style btn-confirm" @click="agreeGetPhoneEvent(true)"
            >允许</view
          >
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { AccountService } from "@/services/AccountService";
// const props = defineProps({
//   message: {
//     type: String,
//     required: true
//   }
// });
const store = new useStore();
let isReading = ref(false);
let refresher_triggered = ref(false);
let submitLoading = ref(false);
let agreeGetPhone = ref(false);
const accessin = () => {
  uni.redirectTo({
    url: "/pages/index/index",
  });
};
const popup_confirm = ref(null);
const toLoginEvent = () => {
  //#ifdef MP
  popup_confirm.value.open();
  return;
  //#endif
  toLogin();
};
const toLogin = () => {
  uni.navigateTo({
    url: "/pages/login/login",
  });
};
const agreeGetPhoneEvent = (flag) => {
  if (flag) {
    popup_confirm.value.close();
    toLogin();

    return;
  }
  popup_confirm.value.close();
};
const getUserInfo = async (phone) => {
  const db = uniCloud.database();
  const userRes = await db
    .collection("hm-user")
    .where(`phone=='${phone}'`)
    .get();
  uni.setStorageSync("user", userRes.result.data[0]);
  store.commit("setUser", userRes.result.data[0]);
  console.log("本地数据完成", userRes);
  return null;
};
const decryptPhoneNumber = async (e) => {
  if (submitLoading.value) {
    return;
  }
  submitLoading.value = true;

  uni.showLoading();
  let { code } = e.detail;
  if (!code) {
    submitLoading.value = false;
    uni.hideLoading();
    return;
  }
  try {
    const res = await AccountService.loginMp(code);
    if (res.result.code) {
      uni.showToast({
        title: res.result.msg,
        duration: 2000,
        icon: "error",
      });
      submitLoading.value = false;
      uni.hideLoading();
      return;
    }
    const { token, phone } = res.result.data;
    uni.setStorageSync("hm_token", token);
    uni.setStorageSync("phone", phone);
    await getUserInfo(phone);
    console.log("登录完成");
    uni.reLaunch({
      url: "/pages/index/index",
    });
    submitLoading.value = false;
    uni.hideLoading();
  } catch (error) {
    console.error(error);
    uni.showToast({
      title: "登录失败",
      icon: "none",
    });
    submitLoading.value = false;
    uni.hideLoading();
  }
};
const start = (async () => {
  // if (!uni.getStorageSync("hm_token")) {
  //   isReading.value = true;
  //   return;
  // }
  try {
    console.log("验证token");
    const res = await store.dispatch("loginEvent");
    console.log("验证token结果", res);
    accessin();
  } catch (error) {
    console.log("err", error);

    isReading.value = true;
  }
})();
const list = [
  {
    title: "首页",
    img: "https://cdn.hotelsys.fun/HM/images/advise/1.png",
    info: "酒店管理",
  },
  {
    title: "房态",
    img: "https://cdn.hotelsys.fun/HM/images/advise/2.png",
    info: "酒店管理",
  },
  {
    title: "财务",
    img: "https://cdn.hotelsys.fun/HM/images/advise/3.png",
    info: "酒店管理",
  },
  {
    title: "功能",
    img: "https://cdn.hotelsys.fun/HM/images/advise/4.png",
    info: "酒店管理",
  },
  {
    title: "收入",
    img: "https://cdn.hotelsys.fun/HM/images/advise/5.png",
    info: "酒店管理",
  },
  {
    title: "房型",
    img: "https://cdn.hotelsys.fun/HM/images/advise/6.png",
    info: "酒店管理",
  },
  {
    title: "员工管理",
    img: "https://cdn.hotelsys.fun/HM/images/advise/7.png",
    info: "酒店管理",
  },
  {
    title: "房间管理",
    img: "https://cdn.hotelsys.fun/HM/images/advise/8.png",
    info: "酒店管理",
  },
  {
    title: "财务统计",
    img: "https://cdn.hotelsys.fun/HM/images/advise/9.png",
    info: "酒店管理",
  },
  {
    title: "收入管理",
    img: "https://cdn.hotelsys.fun/HM/images/advise/10.png",
    info: "酒店管理",
  },
  {
    title: "订单管理",
    img: "https://cdn.hotelsys.fun/HM/images/advise/11.png",
    info: "酒店管理",
  },
  {
    title: "店铺展示",
    img: "https://cdn.hotelsys.fun/HM/images/advise/12.png",
    info: "酒店管理",
  },
  {
    title: "房型展示",
    img: "https://cdn.hotelsys.fun/HM/images/advise/13.png",
    info: "酒店管理",
  },
];

onLoad(() => {

});
const navTopHeight = computed(() => {
  // #ifdef MP-WEIXIN
  return "100px";
  // #endif

  //return this.isPcShow? "0px" : "70px";
  return "70px";
});
const refrush = (e) => {
  console.log(e);
  refresher_triggered.value = true;
  setTimeout(() => {
    refresher_triggered.value = false;
  }, 1000);
};
onMounted(() => {});
</script>

<style lang="scss" scoped>
.indexAdvise {
  background: #eee;
  min-height: 100vh;
  height: 100%;
  background: #0765ae;
  background: url("https://cdn.hotelsys.fun/HM/images/advise/bg9.png");
  background-repeat: no-repeat;
  background-size: cover;
  overflow: auto;

  .introduce {
	  margin-top: 10px;
    max-width: 800px;
    padding: 0 10px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;

    .card {
      /*background: rgba(255, 255, 255, 0.15);
      -webkit-backdrop-filter: blur(5px);
      backdrop-filter: blur(16px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2),inset 0 4px 20px rgba(255, 255, 255, 0.3);*/
      padding: 0 15px 15px 15px;
      box-sizing: border-box;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.48);
      overflow: hidden;
      .title {
        font-weight: 400;
        font-size: 24px;
        padding: 20px 0;
        color: #fff;
      }

      .txt-content {
        font-size: 15px;
        color: #e6e6e6;
        text-indent: 20px;
        letter-spacing: 2px;
        text-align: justify;
      }

      .content {
        display: flex;
        gap: 18px;
        flex-flow: wrap;
        justify-content: space-around;

        .cs {
          height: 0;
        }

        .control-item-group {
          display: flex;
          align-items: center;

          justify-content: center;
          font-size: 12px;
          flex-direction: column;
          font-weight: 400;
          font-size: 15px;
        }

        .img-area {
          width: 140px;
        }

        .barner {
          width: calc(100vw - 50px);
          height: calc(1.5 * (100vw - 50px));
          max-width: 750px;
          /* max-height: calc(1.5 * (750px));*/
          border-radius: 12px;
          overflow: hidden;
        }
      }
      .video-content{
        display: flex;
        justify-content: center;
        position:relative;
		height:75vw;
		padding:0;
      }
    }
  }

  .control {
    position: fixed;
    bottom: 20px;
    width: 100vw;
    padding: 0 20px 20px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    .btn {
      padding: 10px 100px;
      color: #fff;
      font-size: 16px;
      letter-spacing: 2px;
      background-color: rgba(0, 0, 0, 0.48);
    }
  }
}

.glass {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(2px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2),
    inset 0 4px 20px rgba(255, 255, 255, 0.3);
}
.popup-con {
  height: 150px;
  padding: 15px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 16px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  .tit {
    font-weight: 400;
    font-size: 18px;
    color: #666;
  }
  .txt-content {
    font-size: 16px;
    text-indent: 16px;
    color: #999;
  }
  .control {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    .btn-style {
      background: #fff;
      width: 100px;
      height: 35px;
      border: 1px solid #eee;
      text-align: center;
      line-height: 35px;
      border-radius: 5px;
      color: #007aff;
    }
    .btn-confirm {
      color: #fff;
      background: #007aff;
    }
  }
}
</style>

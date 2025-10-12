<template>
  <view>
    <scroll-view class="scroll-style" :scroll-x="false" :scroll-y="true">
      <view class="introduce">
        <view class="share-area">
          <view class="container">
            <!-- #ifdef MP -->

            <view class="icon-item">
              <button class="clearBtn" :plain="true" open-type="share">
                <l-icon name="ri:share-forward-fill" color="#fff" size="24px"></l-icon>
              </button>
            </view>
            <!-- #endif -->
            <!-- #ifndef MP -->

            <view class="icon-item">
              <button class="clearBtn" :plain="true" @click="shareWx()">
                <l-icon   name="ri:share-forward-fill" color="#fff" size="20px"></l-icon>
              </button>
            </view>
            <!-- #endif -->
          </view>
        </view>
        <view class="barner">
          <swiper
            class="barner-swiper"
            :indicator-dots="true"
            :autoplay="true"
            :circular="true"
            indicator-color="#FFF"
          >
            <swiper-item v-for="item of hotel.imagesList">
              <image
                show-menu-by-longpress
                :src="transformImageUrl(item)"
                class="barner-image"
                mode="aspectFill"
              ></image>
            </swiper-item>
          </swiper>
        </view>
        <view class="panal">
          <information :hotel="hotel"></information>
        </view>
        <view class="dev-line"></view>
        <view class="panal">
          <view class="label-title">民宿介绍</view>
          <view style="text-indent: 40rpx">
            <text>
              {{ hotel.hotelIntroduction }}
            </text>
          </view>
        </view>
        <view class="dev-line"></view>
        <view class="panal">
          <view class="label-title">设施服务</view>
          <view>
            <servicesFacilities></servicesFacilities>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import information from "./components/information";
import servicesFacilities from "./components/servicesFacilities";
import { HotelServiceClient } from "@/services/HotelServiceClient";
import LIcon from '../../../uni_modules/lime-icon/components/l-icon/l-icon.vue';
export default {
  name: "introduce",
  components: {
    information,
    servicesFacilities,
    LIcon
  },
  props: {
    hotel: {
      type: Object,
    },
  },
  data() {
    return {
      collectList: [],
      tempFilePath:""
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isCollect() {
      let obj = this.collectList.find(
        (item) => item.hotel_id == this.hotel._id
      );
      return obj ? true : false;
    },
  },
  watch: {
    user(n) {
      if (n.phone) {
        this.getCollectHotel();
      }
    },
  },
  
  methods: {
    transformImageUrl(url=""){
      if(!url){
        return url;
      }
			 return url.replace("https://env-00jxhfhjd231.normal.cloudstatic.cn","https://cdn.hotelsys.fun");
			},
    getShareImgUrl(){
		//console.log("开始下载。。。。。。")
		// //console.log("111111",this.hotel.firstImages);
    //   uni.downloadFile({
    //     url: `${this.hotel.firstImages}`, //仅为示例，并非真实的资源
    //     success: (res) => {
    //       if (res.statusCode === 200) {
    //         //console.log("下载成功", res);
    //         this.tempFilePath=res.tempFilePath;
    //       }
    //     },
    //   });
    },
    shareWx() {
      let imgurl = this.hotel.firstImages.split("?")[0]||'https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/app.png';
      uni.share({
              provider: "weixin", //分享服务提供商（即weixin|qq|sinaweibo）
              type: 5, //小程序
              scene: "WXSceneSession", //provider 为 weixin 时必选 WXSceneSession分享到聊天界面，WXSceneTimeline分享到朋友圈，WXSceneFavorite分享到微信收藏
              title: `${this.hotel.hotelName}`, //分享内容的标题
              summary: `${this.hotel.hotelAddress}`, //分享内容的摘要
              miniProgram: {
                id: "gh_5557133bdd5e",
                type: 0,
                webUrl: "http://uniapp.dcloud.io",
                path: `/pages_client/hotelHome/hotelHome?hotel_id=${this.hotel._id}`,
              },
              //imageUrl: `https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/app.png`,
              imageUrl:`${imgurl}`, //图片地址，type 为 0、2、5 时必选
              success(r) {
                //成功返回的参数
                //console.log(r);
              },
              fail(err) {
                //失败返回的参数
                //console.log(err);
              },
            });
      //     uni.share({
      //     provider: 'weixin',
      //     scene: "WXSceneSession",
      //     type: 5,
      //     imageUrl: `${this.tempFilePath}`,
      //     title: '欢迎体验uniapp',
      //     miniProgram: {
      //         id: 'gh_5557133bdd5e',
      //         path: 'pages/index/index',
      //         type: 0,
      //         webUrl: 'http://uniapp.dcloud.io'
      //     },
      //     success: ret => {
      //         //console.log(JSON.stringify(ret));
      //     }
      // });
    },
    async getCollectHotel() {
      if (!this.user) {
        return;
      }
      const res = await HotelServiceClient.getCollectHotel(this.user.phone);
      this.collectList = res.result.data;
    },

    async addCollectHotel() {
      const res = await HotelServiceClient.addCollectHotel(
        this.user.phone,
        this.hotel._id
      );
      this.getCollectHotel();
    },
    async cancelCollectHotel() {
      let obj = this.collectList.find(
        (item) => item.hotel_id == this.hotel._id
      );
      const res = await HotelServiceClient.cancelCollectHotel(obj._id);
      this.getCollectHotel();
    },
  },

  // 组件周期函数--监听组件挂载完毕
  mounted() {
    this.getCollectHotel();
	this.getShareImgUrl();
  },
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
};
</script>

<style scoped lang="scss">
$showWidth: 800px;
.scroll-style {
  height: calc(100vh - 70px);
}
.introduce {
  max-width: 100vw;
  width: $showWidth;
  margin: auto;
  position: relative;
  background-color: #f1f1f1;
}
.share-area {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  height: 55px;
  padding: 0 20px;
  box-sizing: border-box;
  background-color: transparent;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    .icon-item {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.3);
      padding: 5px;
      width: 30px;
      height: 30px;
      box-sizing: border-box;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }
      .clearBtn{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
.barner {
  max-width: 100vw;
  max-height: 56.25vw;
  height: $showWidth * 0.0625 * 9;
  max-width: 100vw;
}
.barner-swiper {
  max-width: 100vw;
  max-height: 56.25vw;
  width: $showWidth;
  height: $showWidth * 0.0625 * 9;
  box-sizing: border-box;
}
.barner-image {
  max-width: 100vw;
  max-height: 56.25vw;
  width: $showWidth;
  height: $showWidth * 0.0625 * 9;
}
.panal {
  padding: 20px;
  background: #fff;
  box-sizing: border-box;
  .label-title {
    margin-bottom: 10px;
    font-size: 40rpx;
    font-weight: bolder;
    color: rgb(177, 90, 31);
  }
}
.dev-line {
  height: 15px;
  background-color: transparent;
}
</style>

<template>
  <view class="indexAdvise" v-if="isReading">
    <view style="height: 70px"></view>
    <view class="introduce">
      <view class="card glass">
        <view class="title">简介</view>
        <view class="txt-content">
          议宿是一款基于酒店民宿日常事务管理开发的工具类软件，提供基础的房型房间管理，收入与支出的财务管理，财务统计图表。订单与房态管理，并自动生成店铺个性化信息展示，并且能分享给微信好友，方便快速预览。提供app与小程序支持，酒店管理员随身管理类必备工具。</view>
      </view>
      <view class="card glass">
        <view class="title">功能</view>
        <view class="content">
          <view class="control-item-group" @click="createOrderEvent">
            <view><l-icon name="solar:reorder-bold" size="80px" color="#4f99fd" /></view>
            <view><text style="color: #fff">订单管理</text></view>
          </view>
          <view class="control-item-group" @click="createOrderEvent">
            <view><l-icon name="solar:calendar-date-bold-duotone" size="80px" color="#34ce84" /></view>
            <view><text style="color: #fff">房态管理</text></view>
          </view>
          <view class="control-item-group" @click="createOrderEvent">
            <view><l-icon name="ic:sharp-maps-home-work" size="80px" color="#905d3e" /></view>
            <view><text style="color: #fff">房型管理</text></view>
          </view>
          <view class="control-item-group" @click="createOrderEvent">
            <view><l-icon name="material-symbols:bar-chart-4-bars" size="80px" color="orange" /></view>
            <view><text style="color: #fff">财务管理</text></view>
          </view>
          <view class="control-item-group" @click="createOrderEvent">
            <view><l-icon name="icon-park-solid:people-plus-one" size="80px" color="green" /></view>
            <view><text style="color: #fff">员工账号</text></view>
          </view>
          <view class="control-item-group" @click="createOrderEvent">
            <view><l-icon name="majesticons:monitor" size="80px" color="#fff" /></view>
            <view><text style="color: #fff">个性化展示</text></view>
          </view>
        </view>
      </view>
      <view class="card glass">
        <view class="title">界面</view>
        <view class="content">
          <view class="barner">
            <swiper :indicator-dots="true" :autoplay="true" :circular="true" indicator-color="orange" style="height:100%;width:100%"
             >
              <swiper-item v-for="item of list" >
                <view style="height:100%;display:flex;justify-content:center">
                  
                  <image style="height:100%;width:100%;" show-menu-by-longpress :src="item.img" class="barner-image" mode="widthFix"></image>      
                </view>
              </swiper-item>
            </swiper>
          </view>
        </view>
      </view>
    </view>
 

    <!-- <view class="barner">
  	<swiper class="barner-swiper" :indicator-dots="true" :autoplay="true" :circular="true"
  		indicator-color="#FFF">
  		<swiper-item v-for="item of list">
  			<image show-menu-by-longpress :src="item.img" class="barner-image" mode="aspectFill"></image>
  		</swiper-item>
  	</swiper>
  </view> -->
  <view style="height:120px"></view>
    <view class="control">
      <view class="btn glass" @click="toLogin()">登录体验</view>  
     
    </view>
  </view>
</template>

<script setup>
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { ref, onMounted} from "vue";
import { useStore } from 'vuex';
// const props = defineProps({
//   message: {
//     type: String,
//     required: true
//   }
// });
const store = new useStore();
let isReading=ref(false);
const accessin=()=>{
  uni.redirectTo({ url: '/pages/index/index' })
};
const toLogin=()=>{
  uni.navigateTo({ url: '/pages/login/login' })
};
const start=(async ()=>{
  if(!uni.getStorageSync("hm_token")){
      isReading=true;
      return;
  }
  try {
   await store.dispatch("vaildToken"); 
    accessin();

  } catch (error) {
    isReading=true;
  }
  
 
})();
const list = [
  {
    title: "首页",
    img: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/1.png",
    info: "酒店管理"
  },
  {
    title: "房态",
    img: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/2.png",
    info: "酒店管理"
  },
  {
    title: "财务",
    img: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/3.png",
    info: "酒店管理"
  },
  {
    title: "功能",
    img: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/4.png",
    info: "酒店管理"
  },
  {
    title: "收入",
    img: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/5.png",
    info: "酒店管理"
  },
  {
    title: "房型",
    img: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/6.png",
    info: "酒店管理"
  },
  {
    title: "员工管理",
    img: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/7.png",
    info: "酒店管理"
  },
  {
    title: "房间管理",
    img: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/8.png",
    info: "酒店管理"
  },
   {
    title: "财务统计",
    img: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/9.png",
    info: "酒店管理",
  },
   {
    title: "收入管理",
    img: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/10.png",
    info: "酒店管理"
  },
   {
    title: "订单管理",
    img: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/11.png",
    info: "酒店管理"
  },
   {
    title: "店铺展示",
    img: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/12.png",
    info: "酒店管理"
  }, {
    title: "房型展示",
    img: "https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/13.png",
    info: "酒店管理"
  }
];

onLoad(()=>{
  
})

onMounted(()=>{})
</script>

<style lang="scss" scoped>

.indexAdvise {
  background: #eee;
  min-height: 100vh;
  height: 100%;
  background: #0765ae;
  background: url("https://env-00jxhfhjd231.normal.cloudstatic.cn/HM/images/advise/bg17.png");
  background-repeat: no-repeat;
  background-size: cover;

  .introduce {
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
        .barner{
          width: calc(100vw - 50px);
          height:calc(1.5*(100vw - 50px));
          max-width:750px ;
          max-height: calc(1.5*(750px));
          border-radius:12px;overflow:hidden;
          
        }
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
    .btn{
      padding:10px 100px;
      color: #fff;
      font-size: 16px;
      letter-spacing: 2px;
      background-color: #007aff6e;
    }
  }
}
.glass {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(2px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2), inset 0 4px 20px rgba(255, 255, 255, 0.3);
}

</style>

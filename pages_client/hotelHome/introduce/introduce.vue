<template>
  <view>
  <scroll-view class="scroll-style" :scroll-x="false" :scroll-y="true">
    <view class="introduce"> 
      <view class="share-area">
				<view class="container">
          <view class="icon-item"> 
            <uv-icon 
            :name="isCollect?'star-fill':'star'"
            color="#fff"
            labelColor="#fff"
            size="24"
            labelPos="bottom"
            labelSize="12px"
            @click="collectEvent"
                ></uv-icon>
          </view>
					<view class="icon-item">

            <button class="clearBtn" :plain="true" open-type="share">
							<uv-icon 
					name="share"
					color="#fff"
					size="24"
					labelColor="#fff"
					labelPos="bottom"
					labelSize="12px"
          @click="shareHotel"
        			></uv-icon>
				</button> 
		
              </view>
				</view>
			</view>
    <view class="barner">
      <swiper class="barner-swiper"  :indicator-dots="true" :autoplay="true"   :circular="true" indicator-color="#FFF">
      <swiper-item v-for="item of hotel.imagesList">
         <image show-menu-by-longpress :src="item" class="barner-image" mode="aspectFill"></image>						
      </swiper-item>
    </swiper>
    </view>
    <view class="panal">
      <information :hotel="hotel"></information>
    </view>
    <view class="dev-line"></view>
    <view class="panal">
      <view class="label-title">民宿介绍</view>
      <view style="text-indent:40rpx">
        <text>
          {{ hotel.hotelIntroduction }}
        </text>
    </view>
    </view>
    <view class="dev-line"></view>
    <view class="panal">
      <view class="label-title">设施服务</view>
      <servicesFacilities :hotel="hotel"></servicesFacilities>
    </view>
  </view>
  </scroll-view>
</view>
</template>

<script>
import information from './components/information';
import servicesFacilities from './components/servicesFacilities';
import {HotelServiceClient} from "@/services/HotelServiceClient";
export default {
  name: "introduce",
  components:{
    information,
    servicesFacilities
  },
  props: {
    hotel:{
      type:Object
    }
  },
  data() {
    return {
      collectList:[]
    }
  },
  computed: {
    user(){
      return this.$store.state.user;
    },
    isCollect(){
      let obj = this.collectList.find(item=>item.hotel_id == this.hotel._id);
      return obj?true:false;
    }
  },
  watch: {
    user(n){
      console.log("登录状态变更")
      if(n.phone){
        this.getCollectHotel();
      }
    }
  },
  methods: {
    async getCollectHotel(){
      if(!this.user){
        return;
      }
     const res = await HotelServiceClient.getCollectHotel(this.user.phone);
     this.collectList=res.result.data;
    },
    async collectEvent(){
      if(!this.user){
         await this.$store.dispatch("loginEvent")
         return;
      }
   
      if(this.isCollect){
        console.log("取消收藏 ")
        this.cancelCollectHotel();
        return;
      }
      console.log("收藏 ")
      this.addCollectHotel();
 
    },
    async addCollectHotel(){
      const res = await  HotelServiceClient.addCollectHotel(this.user.phone,this.hotel._id);
      console.log("添加成功")
      this.getCollectHotel();
    },
    async cancelCollectHotel(){
      let obj = this.collectList.find(item=>item.hotel_id == this.hotel._id);
      const res = await  HotelServiceClient.cancelCollectHotel(obj._id);
      this.getCollectHotel();
      console.log("取消成功")
    }
  },


  // 组件周期函数--监听组件挂载完毕
  mounted() {
    this.getCollectHotel();
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
}
</script>

<style scoped lang="scss">
$showWidth:800px;
.scroll-style{
  height:calc(100vh - 70px);
}
.introduce{
  max-width: 100vw;
  width:$showWidth;
  margin:auto;
  position: relative;
  background-color:#f1f1f1
}
.share-area{
	position: absolute;
	width: 100%;
	top:0;
	left: 0;
	height: 55px;
	padding:0 20px;
	box-sizing: border-box;
	background-color: transparent;
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	.container{
		display: flex;
		align-items: center;
		justify-content: center;
		gap:12px;
    .icon-item{
      cursor: pointer;
      background-color: rgba(0,0,0,0.3);
      padding:5px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover{
        background-color: rgba(0,0,0,0.5);
      }
    }
	}
}
.barner{
  max-width: 100vw;
  max-height:56.25vw ;
	height:$showWidth*0.0625*9;
  max-width: 100vw;
}
.barner-swiper{
  max-width: 100vw;
  max-height:56.25vw ;
  width: $showWidth;
	height: $showWidth*0.0625*9;
  box-sizing: border-box;
}
.barner-image{
  max-width: 100vw;
  max-height:56.25vw ;
	width: $showWidth;
	height: $showWidth*0.0625*9;
}
.panal{
  padding: 20px;
  background: #fff;
  box-sizing: border-box;
  .label-title{
    margin-bottom: 10px;
    font-size: 40rpx;
    font-weight: bolder;
    color: rgb(177, 90, 31);
    
  }
}
.dev-line{
  height: 15px;
  background-color: transparent;
}
</style>
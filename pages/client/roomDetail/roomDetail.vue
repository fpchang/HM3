<template>
	 <scroll-view class="roomDetail" :scroll-x="false" :scroll-y="true">
		<view class="barner">
			  <swiper class="barner-swiper"  :indicator-dots="true" :autoplay="true" :interval="interval" :duration="duration" :circular="true" indicator-color="#FFF">
			  <swiper-item v-for="item of roomType.imagesList">
				 <image show-menu-by-longpress :src="item" class="barner-image" mode="aspectFill"></image>						
			  </swiper-item>
			</swiper>
		</view>
		<view> 
			<view class="room-info-label">房型信息</view>
			<view class="room-info-list">
			  <view class="room-info-list-item">
				<uni-icons type="personadd-filled" size="30px" color="#000"></uni-icons>
				<view class="la">宜住{{roomType.guestNumber||2}}人</view>
			  </view>      
			  
			  <view class="room-info-list-item">
				<image :src="`${imgsrc}bashroom.svg`" style="width: 30px;height:30px;"></image>
				<view class="la">独立卫生间</view>
			  </view>  
			  <view class="room-info-list-item">
				<image :src="`${imgsrc}area.svg`" style="width: 30px;height:30px;"></image>
				<view>{{roomType.area}}m</view>
			  </view> 
		
			  <view class="room-info-list-item">
				<image :src="`${imgsrc}balcony.svg`" style="width: 30px;height:30px;"></image>
				<view class="la">观景阳台</view>
			  </view>  
			  <view class="room-info-list-item">
				<image :src="`${imgsrc}tv2.svg`" style="width: 30px;height:30px;"></image>
				<view class="la">{{roomType.tvSize}}寸电视</view>
			  </view>
			  <view class="room-info-list-item" v-if="1">
				<image :src="`${imgsrc}soundBox.svg`" style="width: 30px;height:30px;"></image>
				<view class="la">影院音箱</view>
			  </view>  
			  <view class="room-info-list-item" v-if="1">
				<image :src="`${imgsrc}bathrobe2.svg`" style="width: 30px;height:30px;"></image>
				<view class="la">浴袍</view>
			  </view> 
			  <view class="room-info-list-item" v-if="1">
				<image :src="`${imgsrc}toiletries.svg`" style="width: 30px;height:30px;"></image>
				<view class="la">洗漱护理</view>
			  </view> 
			  <view class="room-info-list-item">
				<image :src="`${imgsrc}bed.svg`" style="width: 30px;height:30px;"></image>
				<view class="la">
					<view v-for="item of roomType.bedList">{{item.name}}*{{item.count}}</view>
				  
		
				</view>
			  </view>
			</view>
			<view class="room-info-label">价格信息</view>
			<view class="p-list"> 
				<view class="p-list-item">
					<view class="title-area"> 
						<text>标准价格</text>
					</view>
					<view> 
						<text class="pr-text">￥299</text>
						<text class="edit-text-btn-style">预定</text>
					</view>
					
				</view>
				<view class="p-list-item">
					<view class="title-area"> 
						<text>包含2份早餐</text>
					</view>
					<view> 
						<text class="pr-text">￥399</text>
						<text class="edit-text-btn-style">预定</text>
					</view>
				</view>
				<view class="p-list-item">
					<view class="title-area"> 
						<text>包含2份早餐</text>
						<text>包含2张萤火虫票</text>
					</view>
					
					<view> 
						<text class="pr-text">￥499</text>
						<text class="edit-text-btn-style">预定</text>
					</view>
				</view>
			</view>
		</view>
	
	</scroll-view>
</template>

<script>
import uniIcons from '../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
	export default {
  components: { uniIcons },
		
		data() {
			return {
				imgsrc:"https://env-00jxh1m2dpmq.normal.cloudstatic.cn/HM/images/miniprogram/",
				roomType:null
			}
		},
		computed:{
			isPcShow(){
				return this.$store.state.isPcShow;
			}
		},
		methods: {
			
		},
		onShow(){
			try {
				if(this.isPcShow){
					document.getElementsByTagName('uni-page-head')[0].style.display = 'none';	
				}
				
			} catch (error) {
				
			}
		},
		onLoad(params){
			console.log("params",params);
			this.roomType =JSON.parse(decodeURIComponent(params.roomType));
			console.log("roomType",this.roomType)
		}
	}
</script>

<style lang="scss" scoped>
$showWidth:1200px;
.roomDetail{
	width: $showWidth;
	max-width: 100vw;
	height: 100vh;
	margin: auto;
}
.barner{
	max-width: 100vw;
	max-height:56.25vw ;
	  height: $showWidth*0.0625*9;
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

  .room-info-list {
	display: flex;
	}
	.room-info-label{
	  font-size: 20px;
	  font-weight: bold;
	  padding:20px;
	}
	.room-info-list{
	  padding:0 20px;
	  box-sizing: border-box;
	  flex-wrap: wrap;
	}
	.room-info-list .room-info-list-item{
	  width: 90px;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  font-size: 15px;
	  
	
	}
	.room-info-list .room-info-list-item .la{
	  height: 48px;
	  
	}

	.p-list{
		padding:0 20px;
		.p-list-item{
			padding:15px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-top: 1px solid #eee;
			&:last-child{
				border-bottom: 1px solid #eee;
			}
		.title-area{
			display: flex;
			flex-direction: column;
		}
		.pr-text{
			padding:0 10px;
			color: orange;
			font-weight: bold;
		}
		}
	} 
</style>

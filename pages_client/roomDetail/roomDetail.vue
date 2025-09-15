<template>
	 <scroll-view class="roomDetail" :scroll-x="false" :scroll-y="true" v-if="roomType">
		<view class="container"> 
			<view class="barner">
				<swiper class="barner-swiper"  :indicator-dots="true" :autoplay="true"  :duration="duration" :circular="true" indicator-color="#FFF">
				<swiper-item v-for="item of roomType.imagesList">
				   <image show-menu-by-longpress :src="item" class="barner-image" mode="aspectFill"></image>						
				</swiper-item>
			  </swiper>
		  </view>
		  <view> 
			  <view class="room-info-label">房型信息</view>
			  <unicloud-db v-slot:default="{data, loading, error, options}" collection="hm-facilityConfig" field="name , type , icon" :getone="false" where="type=='roomType'" orderby="name asc"> 
				<view class="room-info-list">
  
				<view class="room-info-list-item">
				  <uni-icons type="personadd-filled" size="30px" color="#000"></uni-icons>
				  <view class="la">宜住{{roomType.guestNumber||2}}人</view>
				</view>      
				
				<!-- <view class="room-info-list-item">
				  <image :src="`${imgsrc}bashroom.svg`" style="width: 30px;height:30px;"></image>
				  <view class="la">独立卫生间</view>
				</view>   -->
				<view class="room-info-list-item">
				  <image :src="`${imgsrc}area.svg`" style="width: 30px;height:30px;"></image>
				  <view>{{roomType.area}}m</view>
				</view> 
		  
			   <block v-for="item of data"> 
				  <view class="room-info-list-item" v-if="roomType.facility&&roomType.facility.includes(item._id)">
					  <image :src="item.icon" style="width: 30px;height:30px;"></image>
					  <view class="la">{{item.name}}</view>
					</view>
			   </block>
				   
				  
				<!-- <view class="room-info-list-item">
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
				 -->
				<view class="room-info-list-item">
				  <image :src="`${imgsrc}bed.svg`" style="width: 30px;height:30px;"></image>
				  <view class="la">
					  <view v-for="item of roomType.bedList">{{item.name}}*{{item.roomList.length}}</view>				  	
				  </view>
				</view>
				
				  <view class="room-info-list-item" style="height: 0;" v-for="i in 5">
					</view>
			  
			  </view>
		  </unicloud-db>
			  <view class="room-info-label">价格信息</view>
			  <view class="p-list" v-if="roomType.remainCount>0"> 
				  <view class="p-list-item" v-if="roomType.priceBase>0">
					<view class="title-area"> 
					  <text>{{roomType.priceBase_name||'标准价格'}}</text>
					</view>
					<view class="pr-area"> 
					  <text class="pr-text">￥{{roomType.priceBase}}</text>
					  <text class="edit-text-btn-style" @click="reserve('priceBase')" v-if="hotel.onlineReserve&&roomType.remainCount>0">预定</text>
					  <text class="edit-text-btn-style" @click="bargain('priceBase')" v-if="hotel.onlineReserve&&roomType.remainCount>0&&roomType.isBargain">议价</text>
					</view>
					
				  </view>
				  <view class="p-list-item" v-if="roomType.priceA>0">
					<view class="title-area"> 
					  <text>{{roomType.priceA_name}}</text>
					</view>
					<view class="pr-area"> 
					  <text class="pr-text">￥{{roomType.priceA}}</text>
					  <text class="edit-text-btn-style" @click="reserve('priceA')" v-if="hotel.onlineReserve&&roomType.remainCount>0">预定</text>
					  <text class="edit-text-btn-style" @click="bargain('priceA')" v-if="hotel.onlineReserve&&roomType.remainCount>0&&roomType.isBargain">议价</text>
					</view>
				  </view>
				  <view class="p-list-item" v-if="roomType.priceB>0">
					<view class="title-area"> 
					  <text>{{roomType.priceB_name}}</text>
					  <text class="text-overflow-ellipsis"></text>
					</view>
					
					<view class="pr-area"> 
					  <text class="pr-text">￥{{roomType.priceB}}</text>
					  <text class="edit-text-btn-style" @click="reserve('priceB')" v-if="hotel.onlineReserve&&roomType.remainCount>0">预定</text>
					  <text class="edit-text-btn-style" @click="bargain('priceB')" v-if="hotel.onlineReserve&&roomType.remainCount>0&&roomType.isBargain">议价</text>
					</view>
				  </view>
				</view>
		  </view>
		</view>
	
	
	</scroll-view>
</template>

<script>
import uniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
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
			},
			config(){
				return this.$store.state.config
			},
			hotel(){
				return this.$store.state.hotelClientStore.hotel;
			}
			
		},
		methods: {
			reserve(p){
      uni.showToast({title:"暂未开放",icon:"none"});
    },
    bargain(p){
      uni.showToast({title:"暂未开放",icon:"none"});
    }
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
			//console.log("params",params);
			this.roomType =JSON.parse(decodeURIComponent(params.roomType));
			//console.log("roomType",this.roomType)
		}
	}
</script>

<style lang="scss" scoped>
$showWidth:1200px;
.roomDetail{
	
	height: 100vh;
	
	.container{
		width: $showWidth;
	max-width: 100vw;
		margin: auto;
	}
}
.barner{
	max-width: 100vw;
	max-height:56.25vw ;
	  height: $showWidth*0.0625*9;
	max-width: 1200px;
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
  .pr-area{
    display: flex;
    flex-wrap: nowrap;
    align-items: baseline;
    justify-content: space-between;
    min-width: 86px;
    gap:8px;
    .pr-text{
      color: #0765ae;
      font-weight: 400;
      padding:0 4px;
    }
  }
  .room-info-list {
	display: flex;
	justify-content: space-between;
	}
	.room-info-label{
	  font-size: 20px;
	  font-weight: 400;
	  padding:20px;
	}
	.room-info-list{
	  padding:0 20px;
	  box-sizing: border-box;
	  flex-wrap: wrap;
	}
	.room-info-list .room-info-list-item{
	  min-width: 80px;
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
			color: #0765ae;
			font-weight: 400;
		}
		}
	} 
</style>

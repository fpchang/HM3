<template>
	<view class="home flex-page">
		<view class="flex-page-content">

				<introduce v-if="tabId=='b1'" :hotel="hotel"></introduce>	
				<roomType v-if="tabId=='b2'" :hotel_id="hotel._id" :range="searchCondition['dateRange']"></roomType>
				<orderDishes v-if="tabId=='b3'" :hotel_id="hotel._id"></orderDishes>
				<showScenicSpot v-if="tabId=='b4'" :hotel_id="hotel._id"></showScenicSpot>			
		</view>
		<view class="flex-flex-page-bottom">
			<xt-tabbar :dataList="tabbarList" @clickTab="clickTab" width="1200px"></xt-tabbar>
		</view>
		
	</view>
</template>

<script>
import introduce from './introduce/introduce';
import roomType from './roomType/roomType';
import orderDishes from './orderDishes/orderDishes';
import showScenicSpot from './scenicSpot/showScenicSpot';
import {useStore} from 'vuex';
import {HotelServiceClient} from "@/services/HotelServiceClient";
	export default {
  components: { introduce,roomType ,orderDishes,showScenicSpot},
  setup(props){
	const store = useStore();
	let config = store.state.config;
	let imgUrl=`${config.cloudUrl}/HM/images/miniprogram/`;
	let 	tabbarList=[
        {id:"b1",label:"首页",icon:`${imgUrl}introduce-line-black.svg`,activeIcon:`${imgUrl}introduce-line-blue.svg`},
        {id:"b2",label:"房型",icon:`${imgUrl}bed-line-black.svg`,activeIcon:`${imgUrl}bed-line-blue.svg`},
        {id:"b3",label:"餐饮",icon:`${imgUrl}food.svg`,activeIcon:`${imgUrl}food-blue.svg`},
		{id:"b4",label:"景点",icon:`${imgUrl}scenicSpot-black.png`,activeIcon:`${imgUrl}scenicSpot-blue.png`}
		
      ]
	  return {
		config,
		tabbarList
	 	 }
 	 },
		data() {
			return {
	  			tabId:"b1",
				content: [{
						iconPath: '/static/image.png',
						selectedIconPath: '/static/image-active.png',
						text: '相册',
						active: false
					},
					{
						iconPath: '/static/home.png',
						selectedIconPath: '/static/home-active.png',
						text: '首页',
						active: false
					},
					{
						iconPath: '/static/star.png',
						selectedIconPath: '/static/star-active.png',
						text: '收藏',
						active: false
					}
				]
			}
		},
		
		computed:{
			hotel(){
				console.log(this.$store.state)
				return this.$store.state.hotelClientStore.hotel;
			},
			searchCondition(){
				return this.$store.state.hotelClientStore.searchCondition;
			}
		},
		watch:{
			tabId(val){
				const titleObj={
					"b1":"简介",
					"b2":"房型",
					"b3":"订餐",
					"b4":"景点"
				}
				
				uni.setNavigationBarTitle({
        			title:`【${this.hotel.hotelName}】${titleObj[val]}` ,
      				});
			}
		},
		onLoad(params){
			console.log("hotelHome",params)
			if(params.hotel_id){//分享进来的页面
					this.getHotel(params.hotel_id);
					//this.dateRange = [Date.now(),Date.now()+1000*60*60*24];
				}
			
		},
		created(){
			console.log("hotelHome created",this.hotel,this.searchCondition)
			try {
					uni.setNavigationBarTitle({
        			title:`【${this.hotel.hotelName}】简介` ,
      				});				
				
			} catch (error) {
				
			}
		},
		onShow(){
			if(this.$store.state.isPcShow){
				uni.hideTabBar();
			}
			//if(this.isPcShow){
			// #ifdef H5
			try {
				document.getElementsByTagName('uni-page-head')[0].style.display = 'none';
			} catch (error) {
				
			}
			// #endif
		},
		onShareAppMessage(res) {
		if (res.from == "button") {
		// 来自页面内分享按钮
		let url =this.hotel.firstImages||`${this.$store.state.config.cloudUrl}/HM/images/hotel.jpg`;
		return {
			title: "议宿",
			imageUrl: url,
			path: `/pages_client/hotelHome/hotelHome?hotel_id=${this.hotel._id}`,
		};
		}

  },
  onPullDownRefresh() {
	let tabid=this.tabId;
	this.tabId="";
	this.$nextTick(()=>{
		this.tabId = tabid;
	})
  },
		methods: {
			clickTab(id){
				console.log(id);
				this.tabId=id;
			},
			async getHotel(hotel_id){
			const res=	await HotelServiceClient.getHotel(hotel_id);
			console.log("当前酒店",res);
			//this.hotel=res.result.data[0];
			this.$store.commit("hotelClientStore/updateHotel",res.result.data[0])
				uni.setNavigationBarTitle({
        			title:`【${this.hotel.hotelName}】简介` ,
      				});
			}
		}
	}
</script>

<style lang="scss" scoped>
$showWidth:100vw;
.home{	
	margin: auto;
	width:$showWidth ;
	max-width: 100vw;
}

.xt-swiper{
	width: 100vw;
	.xt-swiper-item{
		width:100vw;
		max-width:375px;
		background: red;
	}
	.dev{
		width: 5px;
		background-color: #eee;
	}
}
</style>

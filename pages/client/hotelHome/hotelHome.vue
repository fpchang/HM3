<template>
	<view class="home flex-page">
		<view class="flex-page-content">

				<introduce v-show="tabId=='b1'" :hotel="hotel"></introduce>	
				<roomType v-if="tabId=='b2'" :hotel_id="hotel._id"></roomType>
				<orderDishes v-if="tabId=='b3'" :hotel_id="hotel._id"></orderDishes>			
		</view>
		<view class="flex-flex-page-bottom">
			<xt-tabbar :dataList="tabbarList" @clickTab="clickTab" width="1200px"></xt-tabbar>
		</view>
		<uni-fab ref="fab" :pattern="pattern" :content="content" horizontal="right" vertical="bottom"
			direction="vertical" @trigger="trigger" @fabClick="fabClick" />
	</view>
</template>

<script>
import introduce from './introduce/introduce';
import roomType from './roomType/roomType';
import orderDishes from './orderDishes/orderDishes';
import {useStore} from 'vuex';
	export default {
  components: { introduce,roomType ,orderDishes},
  setup(props){
	const store = useStore();
	let config = store.state.config;
	let imgUrl=`${config.cloudUrl}/HM/images/miniprogram/`;
	let 	tabbarList=[
        {id:"b1",label:"首页",icon:`${imgUrl}introduce-line-black.svg`,activeIcon:`${imgUrl}introduce-line-blue.svg`},
        {id:"b2",label:"房型",icon:`${imgUrl}bed-line-black.svg`,activeIcon:`${imgUrl}bed-line-blue.svg`},
        {id:"b3",label:"餐饮",icon:`${imgUrl}food.svg`,activeIcon:`${imgUrl}food-blue.svg`}
      ]
	  store.commit("updateCurrentHotel_id",props.hotel._id);
	  return {
		config,
		tabbarList
	 	 }
 	 },
		data() {
			return {
	  			tabId:"b1",
				hotel:{},
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
		},
		watch:{
			tabId(val){
				const titleObj={
					"b1":"简介",
					"b2":"房型",
					"b3":"订餐"
				}
				
				uni.setNavigationBarTitle({
        			title:`【${this.hotel.hotelName}】${titleObj[val]}` ,
      				});
			}
		},
		onLoad(params){
			try {
				console.log("传递参数",params)
				this.hotel = JSON.parse(decodeURIComponent(params.hotel)) ;
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
		console.log("uuuuuuuuuu",url)
		return {
			title: "民宿管家",
			imageUrl: url,
			path: `/pages/client/hotelHome/hotelHome?hotel_id=${this.hotel._id}`,
		};
		}

  },
		methods: {
			clickTab(id){
				console.log(id);
				this.tabId=id;
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

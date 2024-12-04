<template>
	<view class="home flex-page">
		<view class="flex-page-content">
				<!-- <view class="xt-swiper"> 
					<view style="display: flex;width:fit-content">
						<view class="xt-swiper-item"> 
							<introduce v-if="tabId=='b1'" :hotel="hotel"></introduce>
						</view>
						<view class="xt-swiper-item"> 
							<introduce v-if="tabId=='b1'" :hotel="hotel"></introduce>
						</view> 				
					</view> 
				</view> -->

				<introduce v-show="tabId=='b1'" :hotel="hotel"></introduce>	
				<roomType v-show="tabId=='b2'" :hotel_id="hotel._id"></roomType>
				<orderDishes v-if="tabId=='b3'" :hotel_id="hotel._id"></orderDishes>			
		</view>
		<view class="flex-flex-page-bottom">
			<xt-tabbar :dataList="tabbarList" @clickTab="clickTab"></xt-tabbar>
		</view>
		
	</view>
</template>

<script>
import introduce from './introduce/introduce';
import roomType from './roomType/roomType';
import orderDishes from './orderDishes/orderDishes';
	export default {
  components: { introduce,roomType ,orderDishes},
		data() {
			return {
				tabbarList:[
        {id:"b1",label:"首页",icon:"introduce-line-black.svg",activeIcon:"introduce-line-blue.svg"},
        {id:"b2",label:"房型",icon:"bed-line-black.svg",activeIcon:"bed-line-blue.svg"},
        {id:"b3",label:"餐饮",icon:"food.svg",activeIcon:"food-blue.svg"}
      ],
	  	tabId:"b1",
				hotel:{}
			}
		},
		computed:{
		},
		onLoad(params){
			try {
				console.log("传递参数",params)
				this.hotel = JSON.parse(decodeURIComponent(params.hotel)) ;

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

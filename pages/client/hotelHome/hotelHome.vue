<template>
	<view class="home flex-page">
		<view class="flex-page-content"> 
			<introduce v-if="tabId=='b1'" :hotel="hotel"></introduce>
			
		</view>
		<view class="flex-flex-page-bottom">
			<xt-tabbar :dataList="tabbarList" @clickTab="clickTab"></xt-tabbar>
		</view>
		
	</view>
</template>

<script>
import introduce from './introduce/introduce';
	export default {
  components: { introduce },
		data() {
			return {
				tabbarList:[
        {id:"b1",label:"首页",icon:"introduce-line-black.svg",activeIcon:"introduce-line-blue.svg"},
        {id:"b2",label:"我的",icon:"bed-line-black.svg",activeIcon:"bed-line-blue.svg"},
        {id:"b3",label:"餐饮",icon:"food.svg",activeIcon:"food-blue.svg"},
        {id:"b4",label:"我的",icon:"mine-line-black.svg",activeIcon:"mine-line-blue.svg"}
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
.home{
	max-width: 450px;
	margin: auto;
}

</style>

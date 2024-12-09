<template>
	<view class="index">
		<view class="container" v-if="!isLoading"> 
			<view class="item">
				<view  class="card" @click="selectRole('user')"> 
					<view class="i"><uni-icons type="person-filled" size="100"></uni-icons></view>
					<view class="h">我是用户</view>
					<view><uni-icons type="forward" size="80" color="#a1a1a1"></uni-icons></view>
				</view>
			</view>
			<view class="item">
				<view  class="card"  @click="selectRole('hotel')"> 
					<view class="i"><uni-icons type="shop-filled" size="100"></uni-icons></view>
					<view class="h">我是商家</view>
					<view><uni-icons type="forward" size="80" color="#a1a1a1"></uni-icons></view>
				</view>
			</view>
			<!-- <view class="item">
				<view style="background: #eee;" class="card"  @click="selectRole('travelAgency')"> 
					<view class="i"><uni-icons type="shop-filled" size="100"></uni-icons></view>
					<view class="h">我是旅行社</view>
					<view><uni-icons type="forward" size="80" color="#a1a1a1"></uni-icons></view>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
import {AccountService} from "../../services/AccountService";
import UniIcons from '../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
	
	export default {
		components: {
		UniIcons
			
		},

		data() {
			return {
				isLoading:true
			};
		},
		async onLoad(e) {
			// const { proxy } = getCurrentInstance();
			// await proxy.$onLaunched;
			await this.setConfig();
			this.isLoading=false;
			let userRole =uni.getStorageSync("userRole");
			if(!userRole){
				return;
			}
			if(userRole=="hotel"){
				uni.switchTab({url:"/pages/home/home"});
			}else{
				uni.redirectTo({
        		url:"/pages/client/client_index/client_index",
      		});
			}
			

		},
		created() {
		
		},
		onShow() {
			
		},
		onShareAppMessage(res) {
		
		},
		beforeMounted(){
			if(this.$store.state.isPcShow){
				uni.hideTabBar()
			}
			console.log("before mounted....>>>")
		},
		mounted() {
			console.log("index mounted....>>>",this.$store);
			
		},
		onPullDownRefresh() {
			
			
		},
		computed: {
			
		},
		watch: {
			
		},
		methods: {

			selectRole(role){
				switch(role){
					case "user":
						uni.setStorageSync("userRole","user");
						uni.reLaunch({
							url:"/pages/client/client_index/client_index"
						});
					break;
					case "hotel":
					uni.setStorageSync("userRole","hotel");
					uni.reLaunch({
							url:"/pages/home/home"
						})
					break;
					
					case "travelAgency":
					uni.setStorageSync("userRole","travelAgency");
					break;
				}
			},
			async setConfig(){
				try {
					const res = await AccountService.getConfig();
					console.log("参数config",res);
					this.$store.commit("setConfig",res.result)
				} catch (error) {
					console.error(error)
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
.index{
	height: 100vh;
	width: 100vw;
	display: flex;
	align-items: center;
	justify-content: center;
}
	.container{
		max-width: 450px;
		flex: 1;
		.item{
		
			padding:20px;
			box-sizing: border-box;
		.card{
			cursor: pointer;
			display: flex;
			align-items: center;
			border-radius: 12px;
			transition: transform 0.3s ease;
			background: #eee;
			&:hover{
				transform: scale(1.1);
				background: #ddd;
				color: #313131;
			}
			.i{
				padding:20px;
			}
			.h{
				flex: 1;
				color:#a1a1a1;
				font-size: 20px;
				
			}
		}
		}
	}
</style>
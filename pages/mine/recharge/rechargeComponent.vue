<template>
	<view>
		<view class="list">
			<view class="list-item" v-for="item of rechargeConfigList" @click="rechargeEvent(item)">
				<text>{{item.name}}</text>
				<text>{{item.price}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import  {AccountService} from "../../../services/AccountService";
	export default {
		data() {
			return {
				isLoading:false,
				rechargeConfigList:null,
			}
		},
		created() {
			this.getRechargeConfig();
		},
		methods: {
			async getRechargeConfig(){
				const res = await  AccountService.getRechargeConfig();
				//console.log("rechcargeconfig",res);
				this.rechargeConfigList = res.result.data;
			},	
			async rechargeEvent(item){
				if(this.isLoading){
					return;
				}
				this.isLoading=true;
				uni.showLoading();
				try{
					const res = await AccountService.createRechargeOrder(item._id);
					if(res.result.code!=0){
						throw Error("创建订单失败",res);
						return;
					}
					//console.log("创建成功",res);
					this.isLoading=false;
					uni.hideLoading();
					this.vipRecharge(res.result.optionsStr);
				}catch(e){
					console.error(e)
					this.isLoading=false;
					uni.hideLoading();
				}
				
			},
			
			async vipRecharge(optionsStr) {
				//await 
		
				uni.navigateTo({
					url: `/uni_modules/uni-pay/pages/pay-desk/pay-desk?options=${optionsStr}`
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.list{
	display: flex;
	background-color: #fff;
	.list-item{
		height: 150px;
		display: flex;
		align-items: center;
		padding:20px;
		flex-direction: column;
		flex: 1;
		cursor: pointer;
		&:hover{
			background-color: $btn-bgColor;
		}
	}
}
</style>

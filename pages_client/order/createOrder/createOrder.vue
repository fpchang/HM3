<template>
	<view class="order flex-page">
		<view class="flex-page-content">
			<createOrderComponent v-if="formData" ref="createOrderComponent" :formData="formData" @setPriceTotal="setPriceTotal"></createOrderComponent>
		</view>
		<!-- <view class="flex-page-bottom flex-page-bottom-shadow">
			<view style="padding:0 20px"> 
				<view class="pay-area"> 
					<view style="flex:1"><text>在线支付</text><text class="rmb">￥{{priceTotal}}</text></view>
					<button size="default" type="default" class="btn" @click="payEvent">立即支付</button>
				</view>
				<view style="height:20px"></view>
			</view>
			
		</view> -->
		
	</view>
</template>

<script>
import createOrderComponent from './createOrderComponent';
	export default {
		components:{
			createOrderComponent
		},
		data() {
			return {
				priceTotal:null,
				formData:null,
				

			}
		},
		computed:{
			user(){
				return this.$store.state.user
			}
		},
		onLoad(params){
			console.log("参数传递", params);
			try {
				this.formData={
					orderType: params.orderType,
					priceField:params.priceField,
					roomType:JSON.parse(decodeURIComponent(params.roomType)),
					dateRange:[Number(params.st),Number(params.et)]

				}
				
				
			} catch (error) {
			}
		},
		methods: {
			setPriceTotal(p){
				this.priceTotal=p;
			},
			payEvent(){
			 this.$refs.createOrderComponent.submitForm();
			}
		}
	}
</script>

<style lang="scss" scoped>
.order{
	
}
.pay-area{
	height: 60px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 14px;
	.rmb{
		color:#0765ae;
		font-weight: 400;
		font-size: 20px;
		padding:0 10px;
	}
	.btn{
		background-color: #0765ae;
		color:#fff;
		width: 120px;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom-right-radius:37%
	}
}

</style>

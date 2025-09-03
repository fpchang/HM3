<template>
	<view class="createOrder">
		<scroll-view :scroll-y="true" :scroll-x="false" class="scroll-view" style="height:100vh">
			<view class="container"> 
				<createOrderComponent @closePopup="closePopup"></createOrderComponent>
			</view>
			
		</scroll-view>

	</view>
</template>

<script>
	import createOrderComponent from '../components/createOrderComponent';
	export default {
		components: {
			createOrderComponent
		},
		data() {
			return {

			}
		},

		methods: {
			closePopup(){
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
.createOrder{
	background: #fff;
}
	.scroll-view {
		height: 100vh;
		box-sizing: border-box;
		.container{
			padding: 20px 15px;
		}
		
		box-sizing: border-box;
		height:100vh;
	}
</style>
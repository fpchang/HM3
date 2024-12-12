<template>
	<view class="orderList">
		<xt-panal-list :dataList="hotelList">

			<!-- #ifdef MP -->
			<view v-for="(item,index) of [1]" slot="card{{index}}">


			</view>
			<!-- #endif -->
			<!-- #ifdef H5 || APP-PLUS -->
			<template v-for="(item,index) of [1]" v-slot:[`card${index}`]>
				<view>
					<view class="title">
						<text>德清天龙宾馆</text>
					</view>
					<view class="address">
						<text>浙江省湖州</text>
					</view>
					<view class="info">
						<text>2024-12-24至2024-12-26</text><text>1间2晚</text><text>大床房</text>
					</view>
					<view class="price">
						<text>在线支付</text><text>￥133</text>
					</view>
				</view>
			</template>
			<!-- #endif -->


		</xt-panal-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList:[]
			}
		},
		computed:{
			user(){
				reutrn this.$store.state.user;
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.orderList{

}
</style>

<template>
	<view class="financiaHome">
		<view :style="{'height':topHeight}"></view>
		<view class="title">
			<text>财务中心</text>
			<!-- <text><l-icon name="icon-park-solid:financing-two" size="28px" color="#fff"/></text> -->
		</view>
		<view class="subtitle">
			<view>年度汇总</view>
			<view>
				<navigator url="/pages/financialManagement/fmChart/fmChart" hover-class="none">
					<l-icon name="fluent:more-circle-24-filled" size="35px" color="#fff" />
				</navigator>

			</view>
		</view>
		<view class="content">
			<fmYearAndMonth ref="fmYearAndMonth"></fmYearAndMonth>

		</view>
	</view>
</template>

<script>
import LIcon from '../../../uni_modules/lime-icon/components/l-icon/l-icon.vue';
	import fmYearAndMonth from "../components/fmYearAndMonth";
import { colorGradient } from '@/uni_modules/uv-ui-tools/libs/function/colorGradient.js';
	export default {
		components:{
			fmYearAndMonth,
LIcon
		},
		data() {
			return {
				
			}
		},
		onShow() {
			if(this.$refs.fmYearAndMonth){
				this.$refs.fmYearAndMonth.refrushData();
			}
			console.log("onshow",this.$store.state)
		},
		async onPullDownRefresh() {
			await this.$refs.fmYearAndMonth.refrushData();
    		uni.stopPullDownRefresh();
  		},
		computed:{
			    hotel_id() {
      			return this.$store.state.hotel_id;
    		},
			topHeight(){
				return this.$store.state.topHeight;
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.financiaHome {

	min-height: 100vh;
	background: linear-gradient(162deg, #0765ae, #0765ae, #0765ae7a);

	.title {
		color: #fff;
		font-size: 24px;
		padding: 0 18px;
		display: flex;
		align-items: center;
		justify-content: flex-start;

	}

	.subtitle {
		color: #fff;
		font-size: 18px;
		padding: 10px 18px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: hidden;


	}
}
</style>

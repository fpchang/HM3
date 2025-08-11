<template>
	<view class="financiaHome">
		<!-- <fmIndexComponent ref="fmIndexComponent"></fmIndexComponent> -->
		<view style="height:70px"></view>
		<view class="title">
			<text>财务中心</text>
			<!-- <text><l-icon name="icon-park-solid:financing-two" size="28px" color="#fff"/></text> -->
		</view>
		<view class="subtitle">
			<text>年度汇总</text>
			<text>
				<l-icon name="fluent:more-circle-24-filled" size="35px" color="#fff"/>
			</text>
		</view>
		<view class="content">
			<view class="chart-list">
				<view class="chart-item" style="background:#0c37aa">
					<view class="item-title"><text>本月收入</text></view>
					<view class="item-con"><text>￥15999889.8</text></view>
				</view>
				<view class="chart-item" style="background:#3698fc">
					<view class="item-title"><text>本月支出</text></view>
					<view class="item-con"><text>￥11999889.8</text></view>
				</view>
				<view class="chart-item" style="background:#3698fc">
					<view class="item-title"><text>本年收入</text></view>
					<view class="item-con"><text>￥25999889.8</text></view>
				</view>
				<view class="chart-item item-white" style="background:#ffffff">
					<view class="item-title"><text>本年支出</text></view>
					<view class="item-con"><text>￥35889.8</text></view>
				</view>
			</view>
			<view class="chart-view">
				
				<view class="chart-area">
					<view class="chart-title"><text>年度统计</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import LIcon from '../../../uni_modules/lime-icon/components/l-icon/l-icon.vue';
	import fmIndexComponent from "../components/fmIndexComponent";
import { colorGradient } from '@/uni_modules/uv-ui-tools/libs/function/colorGradient.js';
	export default {
		components:{
			fmIndexComponent,
LIcon
		},
		data() {
			return {
				
			}
		},
		async onPullDownRefresh() {
			await this.$refs.fmIndexComponent.refrushData();
    		uni.stopPullDownRefresh();
  		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.financiaHome {
	height: 100vh;
	background-image: linear-gradient(162deg, #0765ae, #0765ae, #0765ae7a);

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
		display: flex;
		flex-direction: column;
		justify-content: center;
		.chart-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			gap: 20px;
			padding:20px 0;
			.chart-item {
				min-height: 150px;
				width: 160px;
			
				border-radius: 8px;
				box-sizing: border-box;
				padding: 15px;
				color: #fff;
				overflow: hidden;

				.item-title {
					font-size: 15px;
					padding-top: 8px;
				}

				.item-con {
					font-size: 24px;
					font-weight: bold;
					padding: 15px 0;
					overflow: hidden;
					word-wrap: break-word;
					word-break: break-all;
				}
			}
			.item-white{
				.item-title{
					color: #666;
				}
				.item-con{
				color: #333;
				}
			}
		}
		.chart-view{									
			padding:20px;
			display: flex;
			box-sizing: border-box;
			justify-content: center;
			flex-direction: column;
				
			.chart-area{
				flex: 1;
				border-radius: 8px;
				background-color: #fff;
				min-height: 400px;
				max-width: 800px;
				.chart-title {
					font-size: 18px;
					color: #2C405A;
					font-weight: 400;
					padding:15px;
				}
				.chart{}
			
			}

		}
	}
}
</style>

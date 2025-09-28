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
				<navigator url="/pages_charts/fmChart/fmChart" hover-class="none">
					<l-icon name="fluent:more-circle-24-filled" size="35px" color="#fff" />
				</navigator>

			</view>
		</view>
		<view class="content">
			<fmYm ref="fmYearAndMonth"></fmYm>
			
		</view>
	</view>
</template>

<script>
	import { FMService } from "../../../services/FMService";
import LIcon from '../../../uni_modules/lime-icon/components/l-icon/l-icon.vue';
		import fmYm from "/pages_charts/components/fmYm";

	export default {
		components:{ 
			fmYm,
			LIcon
		},
	data() {
			return {
				}
			
		},
		onShow() {
		
		},
		async onPullDownRefresh() {
			await this.refrushData();
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
		watch: {
			hotel_id() {
				this.refrushData();
		
			}
		},
		created() {
			console.warn("create>>>>>>")
			this.refrushData();
		},
		methods: {
			async refrushData() {
					this.$refs.fmYearAndMonth.refrushData()
				}
			
		}
	}
</script>

<style lang="scss">
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
	.fmYearAndMonth {
		display: flex;
		flex-direction: column;
		overflow: hidden;

		.chart-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			gap: 15px;
			padding: 15px;
			box-sizing: border-box;

			.chart-item {
				min-height: 150px;
				width: 155px;

				border-radius: 8px;
				box-sizing: border-box;
				padding: 15px;
				color: #fff;
				overflow: hidden;
				position: relative;

				.more {
					text-align: right;
					position: absolute;
					right: 10px;
					top: 10px;
				}

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

			.item-white {
				.item-title {
					color: #666;
				}

				.item-con {
					color: #333;
				}
			}
		}

		.chart-view {
			padding: 20px 15px;
			display: flex;
			box-sizing: border-box;
			justify-content: center;

			.chart-area {
				flex: 1;
				border-radius: 8px;
				background-color: #fff;
				overflow: hidden;

				.chart-title {
					font-size: 18px;
					color: #2c405a;
					font-weight: 400;
					padding: 15px;
				}

				.chart {

					width: 100%;
				}

				.control {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					gap: 8px;
					padding: 10px;

					.btn {
						width: 40px;
						height: 30px;
						background: #0765ae;
						text-align: center;
						color: #fff;
						border-radius: 4px;
					}
				}
			}
		}
	}

</style>

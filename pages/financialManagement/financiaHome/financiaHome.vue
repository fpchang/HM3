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
			<!-- <fmYearAndMonth ref="fmYearAndMonth"></fmYearAndMonth> -->
			<!-- <echartComponent></echartComponent> -->
			<view class="fmYearAndMonth">
			  <view class="chart-list">
			    <view :class="item.class" :style="{background: item.backgroundColor}" v-for="item of chartItemList">
			      <view class="more">
			        <navigator :url="item.href" hover-class="none">
			          <l-icon name="icon-park-solid:more-app" size="24px" :color="item.iconColor"></l-icon>
			        </navigator>
			      </view>
			      <view class="item-title"><text>{{item.title}}</text></view>
			      <view class="item-con"><text>￥{{item.value}}</text></view>
			    </view>
			  </view>
			
			  <view class="chart-view">
			    <view class="chart-area">
			      <view class="chart-title"><text>年度统计（{{new Date().getFullYear()}}）</text></view>
			      <view class="chart">			    
			        <echartComponent  ref="currentYearGroupRef"></echartComponent>
			      </view>
			    </view>
			  </view>
			</view>
		</view>
	</view>
</template>

<script>
	import { FMService } from "../../../services/FMService";
import LIcon from '../../../uni_modules/lime-icon/components/l-icon/l-icon.vue';
		import fmYearAndMonth from "../components/fmYearAndMonth";
		import echartComponent from "/pages_charts/components/echartComponent";

	export default {
		components:{
			fmYearAndMonth,
			echartComponent,
			LIcon
		},
		setup() {
		  let monthFirst = new Date(
		    new Date().getFullYear(),
		    new Date().getMonth(),
		    1
		  ).getTime();
		  let monthLast =
		    new Date(
		      new Date().getFullYear(),
		      new Date().getMonth() + 1,
		      1
		    ).getTime() - 1;
		  let yearFirst = new Date(new Date().getFullYear(), 0, 1).getTime();
		  let yearLast = new Date(new Date().getFullYear(), 12, 1).getTime() - 1;
		  return {
		    monthFirst,
		    monthLast,
		    yearFirst,
		    yearLast,
		  };
		},
		data() {
			return {
					//当月收入 饼图
					currentMonthIncome: {
						series: [{
							data: [],
						}, ],
					},
					//当月支出 饼图
					currentMonthExpenses: {
						series: [{
							data: [],
						}, ],
					},
					//当年收入 柱状图
					currentYearIncome: {
						total: 0,
						data: {
							categories: [],
							series: [{
								name: "总计",
								data: [],
							}, ],
						},
					},
					//当年支出 柱状图
					currentYearExpenses: {
						total: 0,
						data: {
							categories: [],
							series: [{
								name: "总计",
								data: [],
							}, ],
						},
					},
					//当年收入与支出线图
					currentYearGroup: {}
				}
			
		},
		onShow() {
			if(this.$refs.fmYearAndMonth){
				this.$refs.fmYearAndMonth.refrushData();
			}
			//console.log("onshow",this.$store.state)
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
			,
				partialRefreshComName() {
					return this.$store.state.partialRefreshComName;
				},
				//当月总计
				currentMonthIncomeAmount() {
					let count = 0;
					this.currentMonthIncome.series[0].data.map((item) => {
						count += item.value;
					});
					return count;
				},
				currentMonthExpensesAmount() {
					let count = 0;
					this.currentMonthExpenses.series[0].data.map((item) => {
						count += item.value;
					});
					return count;
				},
				chartItemList() {
					return [{
							title: "本月收入",
							value: this.currentMonthIncomeAmount,
							href: "/pages/financialManagement/income/income",
							class: "chart-item",
							backgroundColor: "#0c37aa",
							iconColor: "#fff"
						},
						{
							title: "本月支出",
							value: this.currentMonthExpensesAmount,
							href: "/pages/financialManagement/expenses/expenses",
							class: "chart-item",
							backgroundColor: "#3698fc",
							iconColor: "#fff"
						},
						{
							title: "本年收入",
							value: this.currentYearIncome.total,
							href: "/pages/financialManagement/income/income",
							class: "chart-item",
							backgroundColor: "#3698fc",
							iconColor: "#fff"
						},
						{
							title: "本年支出",
							value: this.currentYearExpenses.total,
							href: "/pages/financialManagement/expenses/expenses",
							class: "chart-item item-white",
							backgroundColor: "#fff",
							iconColor: "#666"
						}
					]
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
					let task = [
						this.getIncomeMonth(),
						this.getExpensesMonth(),
						this.getIncomeCurrentYear(),
						this.getExpensesCurrentYear(),
					];
					const res = await Promise.all(task);
					this.setCurrentYearGroup(res[2].simpleXLabel, res[2].xValue, res[3].xValue);
					//console.log("res====",res);
				},
				//获取收入 月
				async getIncomeMonth() {
					const data = await FMService.getIncomeCurrentMonth(
						this.$store.state.hotel_id
					);
					this.currentMonthIncome.series[0].data = data;
					//console.log("当月统计", data);
					return data;
				},
				//获取支出月
				async getExpensesMonth() {
					const data = await FMService.getExpensesCurrentMonth(
						this.$store.state.hotel_id
					);
					this.currentMonthExpenses.series[0].data = data;
					//console.log("当月统计支出", data);
					return data;
				},
				//获取收入 当年
				async getIncomeCurrentYear() {
					const res = await FMService.getIncomeCurrentYear(
						this.$store.state.hotel_id
					);
					//console.log("当年收入", res);
					this.currentYearIncome = {
						total: res.total,
						data: {
							categories: res.xlable,
							series: [{
								name: "总计",
			
								data: res.xValue,
							}, ],
						},
					};
					return res;
				},
				//获取支出 当年
				async getExpensesCurrentYear() {
					const res = await FMService.getExpensesCurrentYear(
						this.$store.state.hotel_id
					);
					//console.log("当年支出", res);
					this.currentYearExpenses = {
						total: res.total,
						data: {
							categories: res.simpleXLabel,
							series: [{
								name: "总计",
								data: res.xValue,
							}, ],
						},
					};
					return res;
				},
				setCurrentYearGroup(xlable = [], incomeValueArr = [], expensesValurArr = []) {
					let option = {
			
						title: {
							// text: ``,
							// left:'center',
							// 	textStyle:{
							// 	color:'#666'
							// },
							// // top:40,
							// subtextStyle: {
							// 	fontStyle: 'fontWeight',
							// 	color: '#007aff',
							// 	lineHeight: 26,
							// }
						},
						grid: {
							bottom: 60
						},
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'shadow'
							}
						},
						legend: {
							bottom: 0
						},
						xAxis: {
							type: 'category',
							data: xlable,
						},
						yAxis: {
							axisLabel: {
								formatter: function(value) {
									return `${(value/1000)}w`;
								}
							}
						},
						series: [{
								name: "收入",
								type: "line",
								smooth: true,
								symbolSize: 0,
								data: incomeValueArr
							},
							{
								name: "支出",
								type: "bar",
								data: expensesValurArr
							}
						]
			
			
					}
					this.$refs.currentYearGroupRef.init(option);
					console.log("opton", option)
					return option;
				},
			
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
